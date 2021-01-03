class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.requests = [];
    }

    onRequestLoad(onSuccess, requestI, data) {
        // console.log(onSuccess);
        // console.log(requestI);
        // console.log(data.target.response);
        this.requests[requestI] = null;
        if(onSuccess)
            onSuccess(data);
        else 
            console.log("Request successful. Reply: " + data);
    }

    onRequestError(onError, requestI) {
        this.requests[requestI] = null;
        if(onError) 
            onError();
        else 
            console.log("Error on request!");
    }

    getPrologRequest(requestString, onSuccess, onError, port)
    {
            var requestI = 0;
            if(this.requests[0] != null) {
                //requestI = 1;
                this.requests[0].abort();
                this.requests[0] = null;
            }

            var requestPort = port || 8081
            this.requests[requestI] = new XMLHttpRequest();
            this.requests[requestI].open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

            this.requests[requestI].addEventListener("load", this.onRequestLoad.bind(this, onSuccess, requestI));

            this.requests[requestI].addEventListener("error", this.onRequestError.bind(this, onError, requestI));

            this.requests[requestI].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            if(this.send) {
                // console.log("sent " + requestString);
                this.requests[requestI].send();
            } else this.requests[requestI] = null;
    }

    async makeRequest(requestString, onSuccess) 
    {
        this.send = true;

        // Make Request
        // console.log("sending request " + requestString);
        await this.getPrologRequest(requestString, onSuccess, this.handleError);
    }

    stopRequest() {
        if(this.requests[0] != null) {
            this.requests[0].abort();
            this.requests[0] = null;
        }
        if(this.requests[1] != null) {
            this.requests[1].abort();
            this.requests[1] = null;
        }
        this.send = false;
    }

    //Handle the Reply
    handleReply(data){
        console.log(data.target.response);
    }

    //Handle the Reply
    handleError(){
        console.log(">:[");
    }
}
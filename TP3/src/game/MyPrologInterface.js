class MyPrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }

    getPrologRequest(requestString, onSuccess, onError, port)
    {
        // return new Promise((resolve, reject) => {
            var requestPort = port || 8081
            var request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

            var orchestrator = this.orchestrator;

            if(onSuccess) {
                request.addEventListener("load", function(data) {
                    onSuccess(data, orchestrator);
                    // resolve();
                });
            }
            else {
                request.addEventListener("load", function(data){
                    console.log("Request successful. Reply: " + data); 
                    // resolve();
                }); 
            }

            if(onError)
                request.addEventListener("error", onError);
            else 
                request.addEventListener("error", function(){
                    console.log("Error waiting for response"); 
                    // reject();
                });  

            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send();
        // });
    }

    async makeRequest(requestString, onSuccess) 
    {
        //console.log(requestString);
        // Make Request
        await this.getPrologRequest(requestString, onSuccess, this.handleError);
    }

    parseColoursWon(data, orchestrator) {
        var reply = data.target.response;
        orchestrator.updateColours(reply.split('-'));
        orchestrator.setPlaying();
    }

    parseUpdateColours(data, orchestrator) {
        var reply = data.target.response;
        orchestrator.updateColours(reply.split('-'));
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
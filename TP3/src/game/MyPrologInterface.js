class MyPrologInterface {
    getPrologRequest(requestString, onSuccess, onError, port)
    {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(requestString)
    {
        console.log(requestString);
        // Make Request
        this.getPrologRequest(requestString, this.handleReply, this.handleError);
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
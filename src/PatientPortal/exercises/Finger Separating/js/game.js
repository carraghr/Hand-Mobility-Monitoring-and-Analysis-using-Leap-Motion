Game = {

    pause : function() {
        var text = document.getElementById('gameStatus');
        text.innerHTML = "paused";
        this.status = 'paused';
    },

    resume : function(){
        var text = document.getElementById('gameStatus');
        text.innerHTML = "playing";
        this.status = 'playing';
    },

    isPaused :function(){
        return this.status == 'paused';
    },

    isCompleted :function(){
        return this.status == 'complete';
    },

    isPlayable :function(){
        return this.playable == 'playable';
    },

    processTracking : function(repsToDo, sequencePosition, recordings){

        let repCount = this.repsDone;
        if(sequencePosition === this.sequence){
            repCount-=1;
        }

        let start = (repCount === 1 &&  sequencePosition === 1);
        let end = (repCount === repsToDo &&  sequencePosition === this.sequence);

        var temp = { record : { rep : repCount, sequence: sequencePosition, angles : recordings }, start : start, end : end };
        this.webworker.postMessage(temp);


    },

    init : function(){
        this.repsDone = 1;
        this.sequence = seqsToDo;
        console.log(this.sequence);
        console.log(seqsToDo);
        this.score = 0;

        this.webworker = new Worker('../../Finger Separating/js/dataProcessing.js');
        this.webworker.addEventListener('message',  function (e) {

            let str = "";
            let json = JSON.stringify(e.data.record);
            if(e.data.start === true){
                str = '{ "exerciseRecord" : [' + json+ ',';
            }else if(e.data.end === true){
                let cookie = document.cookie.split(';');
                console.log(cookie);
                str = json + ']';
                for(let i = 0; i < cookie.length; i++){
                    if(cookie[i].includes("PHPSESSID")){
                        let value = cookie[i].substring(cookie[i].indexOf("=")).trim();
                        str = str + ',"PHPSESSID" : "' + value +'"';
                    }else if(cookie[i].includes("SelectedHand")){
                        let value = cookie[i].substring(cookie[i].indexOf("=")).trim();
                        str = str + ',"SelectedHand" : "' + value +'"';
                    }
                }
                str = str + ' }';

            }else{
                str = json + ',';
            }

            document.getElementById('json').insertAdjacentHTML( 'beforeend', str );

            if (e.data.end ===true){

                let jsonString = document.getElementById('json').innerHTML;
                let request = new XMLHttpRequest();
                let url = window.location.href;
                let index = url.lastIndexOf('/');
                url = url.substring(0,index) + '/submitData.php';
                request.open("POST", url, true);
                request.setRequestHeader("Content-type","application/json");
                request.send(jsonString);
                request.onreadystatechange = function(){
                    if (request.readyState == 4 && request.status == 200){
                        console.log(request.responseText);
                        if(request.responseText == 1){
                            let redirect = window.location.href;
                            let index2 = redirect.lastIndexOf('/exercises/Finger Separating');
                            redirect = redirect.substring(0,index2);
                            window.location.href = redirect;
                        }
                    }
                };
            }
        });

        this.gl = Main.gl;
        this.speed = 1;
        this.bucket = new Bucket();
        this.bucket.setSize(this.gl.drawingBufferWidth * 0.1, this.gl.drawingBufferHeight * 0.15);
        //this.bucket.setDefaultPosition(this.gl.drawingBufferWidth/2, this.gl.drawingBufferHeight * 0.075);
        this.bucket.create(this.gl.drawingBufferWidth/2, this.gl.drawingBufferHeight * 0.075 ,4);

        this.droplets = [];
        this.leader = 0;
        for(let index = 0; index < this.sequence; index++){
            if(index == 0){
                this.droplets[index] = new Drop();
                this.droplets[index].setCenter(this.gl.drawingBufferWidth / 2, this.gl.drawingBufferHeight * 0.90);
                this.droplets[index].setSize(this.gl.drawingBufferHeight * 0.15);
                this.droplets[index].setColor([1.0, 0.5, 0.0],[0.24, 0.522, 0.863]);
            }else{
                this.droplets[index] = new Drop();
                let center = this.droplets[index -1].getCenter();
                this.droplets[index].setCenter(center.x, center.y + (this.gl.drawingBufferHeight * 0.15) +  (this.gl.drawingBufferHeight * 0.1));
                this.droplets[index].setSize(this.gl.drawingBufferHeight * 0.15);
                this.droplets[index].setColor([1.0, 0.5, 0.0],[0.24, 0.522, 0.863]);
            }
        }
        this.status = 'paused';
        this.playable = 'playable';
    },

    separateLid : function(distance){
        return this.bucket.separateLids(distance);
    },

    tick : function(theta){
        let lastPosition = this.leader;
        for(let index = this.leader; index < this.sequence; index++){
            if(theta > 1){
                this.droplets[index].tick(1);
            }else{
                this.droplets[index].tick(theta);
            }

        }
        let miss = this.bucket.dropLidCollision(this.droplets[this.leader]);
        let goal = this.bucket.dropContentCollision(this.droplets[this.leader]);
        if(miss || goal){
            this.leader = (this.leader + 1) % this.sequence;
            if(this.leader == 0){
                this.repsDone++;
                if(this.repsDone <= repsToDo){
                    for (let index = 0; index < this.sequence; index++) {
                        if (index == 0){
                            this.droplets[index].setCenter(this.gl.drawingBufferWidth / 2, this.gl.drawingBufferHeight * 0.90);
                            this.droplets[index].setSize(this.gl.drawingBufferHeight * 0.15);
                        }else{
                            let center = this.droplets[index - 1].getCenter();
                            this.droplets[index].setCenter(center.x, center.y + (this.gl.drawingBufferHeight * 0.15) +  (this.gl.drawingBufferHeight * 0.1));
                            this.droplets[index].setSize(this.gl.drawingBufferHeight * 0.15);
                        }
                    }
                }else{
                    this.status = "complete";
                }
            }
            if(goal){
                this.score++;
            }
        }
        return lastPosition + 1;
    },

    distanceCheck : function(){
        return (this.bucket.distanceFromDrop(this.droplets[this.leader])) <= (this.gl.drawingBufferHeight * 0.1);
    },

    drawScene : function(){
        this.gl.clearColor(0.24, 0.522, 0.863, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for(let index = this.leader; index < this.sequence; index++){
            this.droplets[index].draw(this.gl);
        }
        this.bucket.draw(this.gl);
    }
};
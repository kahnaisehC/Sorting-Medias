class Bird{
    constructor(lFoot, rFoot, headY){
        this.lFoot = lFoot;
        this.rFoot = rFoot;
        this.headY = headY;
        this.head = {x:null, y:null};
        this.lKnee = null;
        this.rKnee = null;
        this.queue=[];
        this.height = lFoot.y-headY;

        this.#update;
        this.legLength = distance(this.lFoot, this.head);
        this.#update;
    }

    moveTo(lFoot, rFoot, doBounce=false, frameCount = 5){
        for(let i = 1; i<=frameCount; i++){
            const t = i/frameCount;
            const u = Math.sin(t*Math.PI);
            const frame = {
                lFoot:(vLerp(this.lFoot, lFoot, t)),
                rFoot:(vLerp(this.rFoot, rFoot, t))
            };
            if(doBounce){
                frame.lFoot.y -=u*this.legLength*0.1;
                frame.rFoot.y -=u*this.legLength*0.1;
            }
            
            frame["headY"] = frame.lFoot.y - this.height;
            this.queue.push(frame);

    }
}

    #update(){
        
        let changed = false;
        if(this.queue.length>0){
                changed = true;
                const info = this.queue.shift();
                this.lFoot = info.lFoot;
                this.rFoot = info.rFoot;
                this.headY=info.headY;
            }

        this.head=average(this.lFoot, this.rFoot);
        this.head.y=this.headY;

        if(this.legLength){
            this.lKnee = this.#getKnee(this.head, this.lFoot);
            this.rKnee = this.#getKnee(this.head, this.rFoot, Math.PI);

        }else{
            this.lKnee=average(this.lFoot, this.head);
            this.rKnee=average(this.rFoot, this.head);
        }

        return changed;
    }

    #getKnee(head, foot, angleoffset = 0){
        
            const center = average(foot, head);
            const angle = Math.atan2(
                foot.y-head.y,
                foot.x-head.x
            );
            const dist = distance(foot, head);
            const offsetAngle=angle+Math.PI/2+angleoffset;
            const height = Math.sqrt(
                (this.legLength/2)**2-
                (dist/2)**2
            );

            return {
                x:center.x+Math.cos(offsetAngle)*(height-35),
                y:center.y+Math.sin(offsetAngle)*(height-45),

            }
    }

    #drawHead(ctx){
        //cabeza
        ctx.beginPath();
        ctx.fillStyle="blue";
        ctx.strokeStyle = "drakblue";
        const rad = 15;
        ctx.arc(this.head.x, this.head.y, rad, 0, Math.PI*2);
        ctx.stroke();
        ctx.fill();
        const eyeSize=rad*0.6;
        
        //ojo izquiero
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.ellipse(
            this.head.x-rad*0.33, 
            this.head.y, 
            eyeSize*0.5,
            eyeSize*0.7,
            -0.3,
            0,
            Math.PI*2);
        ctx.fill();
        ctx.strokeStyle="black";
        ctx.stroke();
        //pupila izquierda
        
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.ellipse(
            this.head.x-rad*0.32, 
            this.head.y+rad*0.1, 
            eyeSize*0.25,
            eyeSize*0.35,
            -0.3,
            0,
            Math.PI*2);
        ctx.fill();

        //ojo derecho
        ctx.beginPath();
        
        ctx.fillStyle="white";
        ctx.ellipse(
            this.head.x+rad*0.33, 
            this.head.y, 
            eyeSize*0.5,
            eyeSize*0.7,
            0.3,
            0,
            Math.PI*2);
        ctx.fill();
        ctx.strokeStyle="black";
        ctx.stroke();
        //pupila derecha
        
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.ellipse(
            this.head.x+rad*0.32, 
            this.head.y+rad*0.1, 
            eyeSize*0.25,
            eyeSize*0.35,
            0.3,
            0,
            Math.PI*2);
        ctx.fill();

        //pico
        ctx.beginPath();
        ctx.strokestyle="dark orange";
        ctx.fillStyle="orange";
        ctx.moveTo(
            this.head.x-rad*0.22,
            this.head.y+rad*0.3
        );
        ctx.lineTo(
            this.head.x,
            this.head.y+rad*1.3
        );
        ctx.lineTo(
            this.head.x+rad*0.22,
            this.head.y+rad*0.3
        );
        ctx.fill();
        ctx.stroke();

    }


    draw(ctx){
        let changed = this.#update();

        ctx.strokeStyle="black";
        ctx.lineWidth=6;
        ctx.lineJoin="round";
        ctx.lineCap="round";

        ctx.beginPath();
        ctx.moveTo(this.head.x, this.head.y);
        ctx.lineTo(this.lKnee.x, this.lKnee.y);
        ctx.lineTo(this.lFoot.x, this.lFoot.y);
        const ankle =vLerp(this.lKnee, this.lFoot, 0.8);
        const angle =Math.atan2(
            this.lFoot.y-this.lKnee.y,
            this.lFoot.x-this.lKnee.x
        );
        const dist=distance(ankle,this.lFoot);
        const finger1={
            x:ankle.x+dist*Math.cos(angle+0.5),
            y:ankle.y+dist*Math.sin(angle+0.5)
        };
        const finger2={
            x:ankle.x+dist*Math.cos(angle*-0.5),
            y:ankle.y+dist*Math.sin(angle*-0.5)
        };
        
        ctx.moveTo(finger1.x, finger1.y);
        ctx.lineTo(ankle.x, ankle.y);
        ctx.lineTo(finger2.x, finger2.y);
        


        ctx.moveTo(this.head.x, this.head.y);
        ctx.lineTo(this.rKnee.x, this.rKnee.y);
        ctx.lineTo(this.rFoot.x, this.rFoot.y);
        ctx.stroke();

        
        ctx.strokeStyle="yellow";
        ctx.lineWidth=4;
        ctx.stroke();

        ctx.setLineDash([2, 10]);
        ctx.strokeStyle="orange";
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.lineWidth=1;
        

        this.#drawHead(ctx);
        
        return changed;
    }
}
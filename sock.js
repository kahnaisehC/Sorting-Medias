class Sock{
    constructor(x, y, height, color){
        this.width = 10;
        this.height = height;
        this.loc = {x, y};
        this.color = color;
        this.queue=[];
        this.particles = [];
        this.segments = [];
        this.blockHeight = 10;


        this.#createParticles();
    }
    #createParticles(){
        
        const left = this.loc.x-this.width/2;
        const right = this.loc.x+this.width/2;
        const bottom = this.loc.y+this.height;

        this.particles.push(
            new Particle(this.loc, true)
        );
        let curHeight = this.loc.y + this.blockHeight;
        do{
                
            this.particles.push(
                new Particle({x:left, y: curHeight})
            );
            this.particles.push(
                new Particle({x:right, y: curHeight})
            );
                curHeight+=this.blockHeight;
        }while(curHeight<this.height+this.loc.y);



        const lastP = this.particles[this.particles.length-1];
        lastP.loc.x -= this.blockHeight*2;
        lastP.loc.y += this.blockHeight*0.1;
        const secondLastP = this.particles[this.particles.length-2];
        secondLastP.loc.x -= this.blockHeight*2;
        secondLastP.loc.y -= this.blockHeight*0.2;
        const secondSecondLastP = this.particles[this.particles.length-3];
        secondSecondLastP.loc.y+=this.blockHeight;


        this.segments.push(
            new Segment(this.particles[0], this.particles[1])
        );
        this.segments.push(
            new Segment(this.particles[0], this.particles[2])
        );
        this.segments.push(
            new Segment(this.particles[1], this.particles[2])
        );
        for (let i = 3; i<this.particles.length; i+=2){
            this.segments.push(
                new Segment(this.particles[i], this.particles[i-2])
            );
            this.segments.push(
                new Segment(this.particles[i+1], this.particles[i-1])
            );
            this.segments.push(
                new Segment(this.particles[i], this.particles[i+1])
            );
        }
    
        this.segments.push(
            new Segment(lastP, this.particles[this.particles.length-4])
        );

    }

    moveTo(newLoc, frameCount = 5){
        for(let i = 1; i<=frameCount; i++){
            const t = i/frameCount;
            this.queue.push(vLerp(this.loc, newLoc, t));
        }
    }

    draw(ctx){
        let changed = false;
        if(this.queue.length>0){
                changed = true;
                this.loc = this.queue.shift();
                this.particles[0].loc = this.loc;
            }
        const {x, y} = this.loc;
        const left = x-this.width/2;
        const right = x+this.width/2;
        const bottom = y+this.height;


        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.moveTo(this.loc.x, this.loc.y);
        for (let i = 0; i<this.particles.length; i+=2){
            ctx.lineTo(this.particles[i].loc.x, this.particles[i].loc.y);
        }
        for (let i = this.particles.length-2; i>0; i-=2){
            ctx.lineTo(this.particles[i].loc.x, this.particles[i].loc.y);
        }
        ctx.closePath();
        ctx.fill();
        /*
        for(let i = 0; i<this.particles.length; i++){
            this.particles[i].draw(ctx);
        }
        for(let i = 0; i<this.segments.length; i++){
            this.segments[i].draw(ctx);
        }
        */
        return changed;
    }
}
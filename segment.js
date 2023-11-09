class Segment{

    constructor(particleA, particleB){
        this.pA = particleA;
        this.pB = particleB;
        this.len = distance (this.pA.loc, this.pB.loc);
    }
    update(){
        const dir = substract(this.pA.loc, this.pB.loc);
        const curLen = magnitude(dir);
        const diff = curLen-this.len;
        const norm = normalize(dir);
        if(!this.pA.fixed && !this.pB.fixed){
            this.pA.loc=add(
                this.pA.loc, scale(norm, -diff/2)
            );
            this.pB.loc=add(
                this.pB.loc, scale(norm, diff/2)
            );
        }
        else{
            if(this.pA.fixed){
                this.pB.loc = add(this.pB.loc, scale(norm, diff/2));
            }
            else if(this.pB.fixed){
                
                this.pA.loc = add(this.pA.loc, scale(norm, -diff/2));
            }
        }
    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.pA.loc.x, this.pA.loc.y);
        ctx.lineTo(this.pB.loc.x, this.pB.loc.y);
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }

}
myCanvas.width=700;
myCanvas.height=300;


const n = 20;
let margin = 0;
const availableWidth = myCanvas.width-margin; 
const array = [];
const socks = [];
const spacing = myCanvas.width/n;
const stringHeight = myCanvas.height*0.40;

const colors = ["#006400", "#FFF5EE", "#000000", "#A52A2A", "#FF69B4",
                "#9932CC", "#C0C0C0", "#ADD8E6", "#2E8B57", "#E6E6FA", 
                "#3CB371", "#00FFFF", "#BA55D3", "#98FB98", "#F5F5DC",
                "#FAEBD7", "#00FA9A", "#FFD700", "#6495ED", "#FFB6C1"];
//
const socksColors = [];
const jump = new Audio();
jump.src = '/audio/jump.ogg';
const swap = new Audio();
swap.src = '/audio/swap.wav';
const audioPops = []
for (let i = 0; i<6; i++){
    audioPops.push(new Audio());
}
audioPops[0].src = '/audio/p_1.ogg';
audioPops[1].src = '/audio/p_2.ogg';
audioPops[2].src = '/audio/p_3.ogg';
audioPops[3].src = '/audio/p_4.ogg';
audioPops[4].src = '/audio/p_5.ogg';
audioPops[5].src = '/audio/p_5.ogg';

 
for (let i = 0; i<n/2; i++){

    const t = (i/n)*2;
    socksColors.push(colors[i]);
    socksColors.push(colors[i]);
    array.push(lerp(0.3, 1, t));
    array.push(lerp(0.3, 1, t));
}
for(let i = 0; i<array.length/2; i++){
    const j = Math.floor(lerp(0,20, Math.random()));
    [array[j], array[i]] = [array[i], array[j]];
    [socksColors[j], socksColors[i]] = [socksColors[i], socksColors[j]];

}


for(let i = 0; i<array.length; i++){
    const x = i*spacing+spacing/2 + margin;
    const y = stringHeight;
    const height = myCanvas.height*0.4*array[i];
    socks[i]= new Sock(x,y,height, socksColors[i]);
}

const moves = bubbleSort(array);

const bird=new Bird(socks[0].loc, socks[1].loc, myCanvas.height*0.2);

const ctx = myCanvas.getContext("2d");

animate();

function animate(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    
    ctx.beginPath();
    ctx.moveTo(0,stringHeight);
    ctx.lineTo(myCanvas.width, stringHeight);
    ctx.stroke();

    let changed = false;

    for(let i = 0; i<socks.length; i++){

        changed = socks[i].draw(ctx)||changed;
        Physics.update(socks[i].particles, socks[i].segments);

    }

    changed = bird.draw(ctx)||changed;

    if(!changed && moves.length){
        const nextMove = moves.shift();
        const[i, j] = nextMove.indices;

        if(nextMove.type=="swap"){
            let playedAudio = (j/socks.length)*5;
            playedAudio -= playedAudio%1
            console.log(playedAudio);
            audioPops[playedAudio].play();
            socks[i].moveTo(socks[j].loc);
            socks[j].moveTo(socks[i].loc);
            swap.play();
            bird.moveTo(socks[j].loc, socks[i].loc);
            [socks[i], socks[j]] = [socks[j], socks[i]];
        }else{
            jump.play();
            bird.moveTo(socks[i].loc, socks[j].loc, true);
        }
    }
    
    requestAnimationFrame(animate);
}

function bubbleSort(array){
    const moves = [];
    let right = array.length-1;
    let left = 0;
    do{
        var swapped = false;
        for(let i = left+1; i<=right; i++){
            
            moves.push({
                indices:[(i-1), i],
                type: "comparison"
            });
            if(array[i-1]>array[i]){
                moves.push({
                    indices:[(i-1), i],
                    type: "swap"
                });
                swapped=true;
                [array[i-1], array[i]] = [array[i], array[i-1]]; 
            }
        }
        right--;
        for(let i = right; i>=left; i--){
            
            moves.push({
                indices:[i, (i+1)],
                type: "comparison"
            });
            if(array[i]>array[(i+1)]){
                moves.push({
                    indices:[i, (i+1)],
                    type: "swap"
                });
                swapped=true;
                [array[i], array[(i+1)]] = [array[(i+1)], array[i]]; 
            }
        }
        left++;

    }while(swapped);
    return moves;
}

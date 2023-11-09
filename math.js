//linear

function lerp (a, b, t){
    return a+(b-a)*t;
}

//Basic
function vLerp (A, B, t){ 
    const res = {};
 
    for(let attr in A){
     res[attr] = lerp (A[attr], B[attr], t);
    }
     return res;
 }

 function add (A, B){
    const res = {};
 
    for(let attr in A){
     res[attr] = A[attr] + B[attr];
    }
     return res;
 }

 function substract (A, B){
    const res = {};
 
    for(let attr in A){
     res[attr] = A[attr] - B[attr];
    }
     return res;
 }

 function scale (A, scalar){
    const res = {};
 
    for(let attr in A){
     res[attr] = A[attr]*scalar;
    }
     return res;
 }

 function average (A, B){
    const res = {};
 
    for(let attr in A){
     res[attr] = (A[attr]+B[attr])/2;
    }
     return res;
 }

//Magnitude functions

 function magnitude (A){
    let len = 0;
    for(let attr in A){
        len += A[attr]**2;
    }
    return Math.sqrt(len);
 }
 
 function distance (A, B){
    const sub = substract(A,B);
    return magnitude(sub);
 }
 
 function normalize (A){
    return scale(A,1/magnitude(A));
 }



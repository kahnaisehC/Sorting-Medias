class Physics {
    static G = 0.35;

    static update (particles, segments){
        for (let i=0; i<particles.length;i++){
            particles[i].update(Physics.G);
        }
        
        const rigidity =20;
        for (let j=0; j<rigidity; j++){
            for (let i=0; i<segments.length;i++){
                segments[i].update();
            }
        }
    }
}
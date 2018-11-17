function Wall() {
    
    
    this.wallArr = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    
    
    this.update = function() {
        var wallWidth = canvas.width/this.wallArr[0].length, 
            wallHeight = canvas.height/this.wallArr.length;
        
        for (var i = 0; i < this.wallArr.length; i++) {
            for (var j = 0; j < this.wallArr[i].length; j++) {
                if (this.wallArr[i][j] == 1) {
                    context.fillStyle = "black";
                    context.fillRect(j*wallWidth, i*wallHeight, wallWidth, wallHeight);

                    var infoB = bullets.getMinInfo({
                        x: j*wallWidth+wallWidth/2,
                        y: i*wallHeight+wallHeight/2,
                        w: wallWidth,
                        h: wallHeight,
                    }, "wall");
                    if (infoB.touching) {
                        infoB.object.remove = true;
                    }
                }
            }    
        }
    }
    
}
           
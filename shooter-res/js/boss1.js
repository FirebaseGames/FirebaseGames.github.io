var boss1  = {
    w: 100,
    h: 100,
    x: 700,
    y: 200,
    opacity: 1,
    time: 80,
    health:100,
    v: 4,
    moving: false,
    reachedDestination:true,
    xFinal:0,
    yFinal:0,
    movementPatterns1: [
        {x:400, y:200},
        {x:1100, y:200},
        {x:700, y:400}
    ],
    mC: 0,

    moveTo : function(x,y) {
        if (player.dead) return;
        var xToP = x - this.x;
        var yToP = y - this.y;
        var hyp = Math.sqrt(xToP * xToP + yToP * yToP);
        var dx = xToP * this.v / hyp;
        var dy = yToP * this.v / hyp;

        this.x += dx;
        this.y += dy;

        if (Math.abs(this.xFinal-this.x)<10 && Math.abs(this.yFinal-this.y)<10) {
            this.reachedDestination = true;
            this.moving = false;
        }
    },

    update : function() {

        if (this.health <= 25) {

        } else if (this.health <= 50) {

        } else if (this.health <= 75) {
            if (this.time >= 275) {
                this.time = 0;

                chasingEnemies.push({
                    x:this.x,
                    y:this.y
                })
            }

            if (this.reachedDestination) {
                this.moving = true;

                if (this.mC == 0) {
                    this.mC = parseInt(Math.random()*2+1);
                } else if (this.mC == 1) {
                    var wtf = parseInt(Math.random()*2+1);
                    this.mC = (wtf==1) ? 0 : 2;
                } else if (this.mC == 2) {
                    this.mC = parseInt(Math.random()*2);
                } else this.mC = 2;


                this.reachedDestination = false;
                this.xFinal = this.movementPatterns1[this.mC].x;
                this.yFinal = this.movementPatterns1[this.mC].y;
            }

        } else {
            if (this.time >= 100) {
                this.time = 0;

                spreadshots.push({
                    x:this.x,
                    y:this.y,

                }, player.x, player.y);

            }
        }
        this.time++;

        if (!this.reachedDestination && this.moving) {
            this.moveTo(this.xFinal, this.yFinal);
        }



        var infoB = bullets.getMinInfo(this, "enemy");
        if (infoB.dist <= this.w+2) {
            infoB.object.remove = true;
            this.health--;
        }

        drawCircle(this.x, this.y, this.w, "red", this.opacity);
        this.drawHealthBar();
    },

    drawHealthBar : function() {
        var killmyselfw = canvas.width;
        context.fillStyle = "red";
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.fillRect(killmyselfw/2-500, canvas.height-20, this.health*10, 10);
        context.strokeRect(killmyselfw/2-500, canvas.height-20, 1000, 10);
        context.beginPath();
        context.moveTo(killmyselfw/2+250, canvas.height-20);
        context.lineTo(killmyselfw/2+250, canvas.height-10);
        context.stroke();
        context.moveTo(killmyselfw/2, canvas.height-20);
        context.lineTo(killmyselfw/2, canvas.height-10);
        context.stroke();
        context.moveTo(killmyselfw/2-250, canvas.height-20);
        context.lineTo(killmyselfw/2-250, canvas.height-10);
        context.stroke();
    }
};
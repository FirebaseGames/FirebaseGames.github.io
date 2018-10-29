var boss1  = {
    w: 100,
    h: 100,
    x: 1500,
    y: 200,
    opacity: 1,
    time: 80,
    health:40,
    v: 4,
    moving: false,
    reachedDestination:true,
    xFinal:0,
    yFinal:0,
    movementPatterns1: [
        {x:250, y:200},
        {x:900, y:200},
        {x:650, y:400}
    ],
    movementPatterns2: [
        {x:250, y:400},
        {x:900, y:400},
        {x:650, y:180}
    ],
    mC: 0,
    secondBar:false,
    secondHealth:0,
    dead: false,
    scale:0,
    start:true,

    reset: function() {
        this.start = true;
        this.x=2000;
        this.y= 200;
        this.opacity= 1;
        this.time=80;
        this.health=100;
        this.v=4;
        this.moving=false;
        this.reachedDestination=true;
        this.xFinal=0;
        this.yFinal=0;
        this.secondHealth = 0;
        this.secondBar=false;
        this.dead = false;
        this.scale = 0;
    },

    moveTo : function(x,y) {
        if (player.dead) return;
        if (Math.abs(this.xFinal-this.x)<10 && Math.abs(this.yFinal-this.y)<10) {
            this.reachedDestination = true;
            this.moving = false;
            if (this.start) {
                this.start = false;
                this.v = 4;
                this.time = 80;
            }
        }

        var xToP = x - this.x;
        var yToP = y - this.y;
        var hyp = Math.sqrt(xToP * xToP + yToP * yToP);
        var dx = xToP * this.v / hyp;
        var dy = yToP * this.v / hyp;

        this.x += dx;
        this.y += dy;


    },

    die: function() {
        if (this.opacity>0) {
            this.scale-=1;
            this.opacity-=0.01;
            drawCircle(this.x, this.y, this.w+this.scale, "red", this.opacity);
        } else {

            gameState = win;
        }
    },

    update : function() {
        if (this.dead) {
            this.die();
            return;
        }

        if (this.start) {
            if (this.reachedDestination && !this.moving) {
                this.moving=true;
                this.reachedDestination=false;
                this.xFinal = 700;
                this.yFinal = 200;
                this.v = 7;
                this.movementPatterns1= [
                    {x:canvas.width/4, y:canvas.height/4},
                    {x:canvas.width*3/4, y:canvas.height/4},
                    {x:canvas.width/2, y:canvas.height*3/4}
                ];
                
                this.movementPatterns2= [
                    {x:canvas.width/4, y:canvas.height*3/4},
                    {x:canvas.width*3/4, y:canvas.height*3/4},
                    {x:canvas.width/2, y:canvas.height/4}
                ];
            }
        } else if (this.secondBar && this.secondHealth>0) {
            if (this.time >= 20) {
                this.time = 0;
                var xToP = player.x - this.x;
                var yToP = player.y - this.y;
                var hyp = Math.sqrt(xToP * xToP + yToP * yToP);
                bullets.push({
                    x:this.x,
                    y:this.y,
                    v:9,
                    origin:"enemy"
                }, xToP/hyp, yToP/hyp);
            }
        } else if (this.secondBar&&this.secondHealth<=0) {
            this.dead = true;
            bullets.reset();
            chasingEnemies.reset();
            blocking.reset();
            spreadshots.reset();
            revolver.reset();
        } else if (this.health <=0) {

            if ((Math.abs(this.x-1300)>10 || Math.abs(this.y-250)>10) && this.reachedDestination) {
                this.moving = true;
                this.reachedDestination = false;
                this.xFinal = 1300;
                this.yFinal = 250;
                this.v = 6;
            }
            if (this.secondHealth<100) {
                this.loadSecondBar();
            } else {
                this.secondBar=true;
            }


        } else if (this.health <= 25) {
            if ((Math.abs(this.x-700)>10 || Math.abs(this.y-300)>10) && this.reachedDestination) {
                this.moving = true;
                this.reachedDestination = false;
                this.xFinal = 700;
                this.yFinal = 300;
            }
            var ti = (this.health<=10) ? 60: 125;
            if (this.time >= ti) {
                this.time = 0;
                revolver.push({
                    x: this.x,
                    y: this.y
                }, player.x, player.y);
            }
        } else if (this.health <= 50) {
            this.v = 6;
            var ti = (this.health<=30)? 60: 125;
            if (this.time >= ti) {
                this.time = 0;
                blocking.push({
                    x:this.x,
                    y:this.y,
                    v:2
                }, player.x, player.y);
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
                } else this.mC = 1;
                this.reachedDestination = false;
                this.xFinal = this.movementPatterns2[this.mC].x;
                this.yFinal = this.movementPatterns2[this.mC].y;
            }

        } else if (this.health <= 75) {
            var ti = (this.health<=58)?60:175;
            if (this.time >= ti) {
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
            var ti = (this.health<=80)?70:100;
            if (this.time >= ti) {
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
            if (this.health>0 && !this.start) this.health--;
            else if (this.secondBar&&this.secondHealth>0) this.secondHealth-=10;
        }

        drawCircle(this.x, this.y, this.w, "red", this.opacity);
        if (this.health>0)this.drawHealthBar();
        if (this.secondBar) this.drawSecondHealthBar();
    },

    drawHealthBar : function() {
        var killmyselfw = canvas.width;
        if (this.health > 0) {
            context.fillStyle = "red";
            context.lineWidth = 2;
            context.strokeStyle = "black";

            var scaledWidth = killmyselfw/2;
            var healthRatio = scaledWidth/100;

            context.fillRect(killmyselfw / 2 - scaledWidth/2, canvas.height - 20, this.health * healthRatio, 10);
            context.strokeRect(killmyselfw / 2 - scaledWidth/2, canvas.height - 20, scaledWidth, 10);
            context.beginPath();
            context.moveTo(killmyselfw / 2 + scaledWidth/4, canvas.height - 20);
            context.lineTo(killmyselfw / 2 + scaledWidth/4, canvas.height - 10);
            context.stroke();
            context.moveTo(killmyselfw / 2, canvas.height - 20);
            context.lineTo(killmyselfw / 2, canvas.height - 10);
            context.stroke();
            context.moveTo(killmyselfw / 2 - scaledWidth/4, canvas.height - 20);
            context.lineTo(killmyselfw / 2 - scaledWidth/4, canvas.height - 10);
            context.stroke();
        }
        context.fillStyle = "black";
        context.font = "bold 15px Arial";
        context.fillText("Boss 1", killmyselfw/2-scaledWidth/2-scaledWidth/6, canvas.height-11);
    },

    drawSecondHealthBar: function() {
        var killmyselfw = canvas.width;
        context.fillStyle = "#fcaeaf";
        context.lineWidth = 2;
        context.strokeStyle = "black";

        var scaledWidth = killmyselfw/2;
        var healthRatio = scaledWidth/100;

        context.fillRect(killmyselfw / 2 - scaledWidth/2, canvas.height - 20, this.secondHealth * healthRatio, 10);
        context.strokeRect(killmyselfw / 2 - scaledWidth/2, canvas.height - 20, scaledWidth, 10);

        context.fillStyle = "black";
        context.font = "bold 15px Arial";
        context.fillText("B̸̰̝͉͛ö̶͍͚́͊̄̚s̸̲͋̒̐s̶̡̥̪͋̑̕͝ ̸̼̍̅1̶̡̓̄͝", killmyselfw/2-scaledWidth/2-scaledWidth/6, canvas.height-11);
    },

    loadSecondBar: function() {
        if (this.health>0)return;
        this.drawSecondHealthBar();
        if (this.secondHealth<100)
        {
            this.secondHealth++;
        }
        else this.secondBar = true;
    }
};
var player = {
    w : 15,
    h : 15,
    x : 200,
    y : 200,
    velx : 0,
    vely : 0,
    tToAcc: 1,
    dx : 0,
    dy : 0,
    shotTime : 0,
    shotCoolDown : 20,
    scale : 0,
    opacity : 1,
    dead : false,
    isMobile: false,
    moveStick: null,
    shootStick: null,

    reset: function() {
        this.dead = false;
        this.x=200; this.y=200;
        this.opacity=1; this.scale = 0;
        this.dx = 0; this.dy = 0; this.vely =0; this.velx=0;
        this.shotTime = 0;
    },

    checkCollision : function() {
        //check world bounds
        if (this.x + this.w > canvas.width) {
            this.x = canvas.width-this.w;
        } else if (this.x - this.w < 0) {
            this.x = this.w;
        }

        if (this.y + this.h > canvas.height) {
            this.y = canvas.height - this.h;
        } else if (this.y - this.h < 0) {
            this.y = this.h;
        }

        var infoB = bullets.getMinInfo(this, "player");
        if (infoB.dist <= this.w+2) {
            infoB.object.remove = true;
            this.dead = true;
        }

        var infospread = spreadshots.getMinInfo(this);
        if (infospread.dist <= this.w+28) {
            infospread.object.remove = true;
            this.dead = true;
        }

        var infoChase = chasingEnemies.getMinInfo(this);
        if (infoChase.dist <= this.w+25) {
            infoChase.object.remove = true;
            this.dead = true;
        }

        var infoBlock = blocking.getMinInfo(this);
        if (infoBlock.object != undefined) {
            if (infoBlock.dist <= this.w + infoBlock.object.scale + 40) {
                infoBlock.object.remove = true;
                this.dead = true;
            }
        }

        var infoRev = revolver.getMinInfo(this);
        if (infoRev.dist <= this.w+40) {
            infoRev.object.remove = true;
            this.dead = true;
        }


        if (!boss1.dead && Math.sqrt(
            (this.x - boss1.x)*(this.x - boss1.x)+
            (this.y - boss1.y)*(this.y - boss1.y)
        ) <= this.w+boss1.w) {
            this.dead = true;
        }


    },

    die : function() {
        if (player.opacity <= 0) {
            player.opacity = 0;
            gameState=lose;
        } else {
            player.scale += 0.5;
            player.opacity = (Math.floor(player.opacity*100)-1)/100;
        }
    },

    render : function() {
        drawCircle(player.x, player.y, player.w+player.scale, "black", player.opacity);
    },


    checkShoot : function() {
        var jx = 0, jy = 0;

        if (this.isMobile) {
            jx = this.shootStick.deltaX();
            jy = this.shootStick.deltaY();
        } else {
            if (keys[37]) {
                jx = -1;
            } else if (keys[39]) {
                jx = 1;
            }

            if (keys[38]) {
                jy = -1;
            } else if (keys[40]) {
                jy = 1;
            }
        }


        var hyp = Math.sqrt(jx*jx + jy*jy);
        if (hyp != 0 && this.shotTime >= this.shotCoolDown) {
            this.shotTime = 0;
            bullets.push({
                x: this.x,
                y: this.y,
                angle: 0, //in radians
                v: 8,
                origin: "player"
            }, (jx / hyp), jy / hyp);
        }
        this.shotTime++;


    },



    update : function() {
        if (this.dead) {
            this.die();
            return;
        }

        if (!this.isMobile) {
            if (keys[87]) {
                //W
                if (player.vely > -speed) {
                    player.vely--;
                } else {
                    player.vely = -speed;
                }
            }

            if (keys[83]) {
                //S
                if (player.vely < speed) {
                    player.vely++;
                } else {
                    player.vely = speed;
                }
            }

            if (keys[65]) {
                //A
                if (player.velx > -speed) {
                    player.velx--;
                } else {
                    player.velx = -speed;
                }
            }

            if (keys[68]) {
                //D
                if (player.velx < speed) {
                    player.velx++;
                } else {
                    player.velx = speed;
                }
            }
        } else {
            this.dx = -this.moveStick.deltaX();
            this.dy = this.moveStick.deltaY();
            var maxXSpeed = Math.abs(this.dx) /jRadius * speed;
            var maxYSpeed = Math.abs(this.dy) / jRadius * speed;
            var accX = maxXSpeed / this.tToAcc;
            var accY = maxYSpeed / this.tToAcc;
            if (this.dx < 0) {
                this.velx += accX;
                if (this.velx > maxXSpeed) {
                    this.velx = maxXSpeed;
                }
            } else {
                this.velx -= accX;
                if (this.velx < -maxXSpeed){
                    this.velx = -maxXSpeed;
                }
            }
            if (this.dy < 0) {
                this.vely -= accY;
                if (this.vely < -maxYSpeed) this.vely = -maxYSpeed;
            } else {
                this.vely += accY;
                if (this.vely > maxYSpeed) this.vely = maxYSpeed;
            }
        }


        player.velx *= friction;
        player.vely *= friction;
        player.x += player.velx;
        player.y += player.vely;

        this.checkCollision();


        this.checkShoot();

    }
};
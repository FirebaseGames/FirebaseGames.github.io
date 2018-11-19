/*
     1 - P1 Move && Shoot
     3 - P1 Shoot
     
     2 - P2 Move && Shoot
     4 - P2 Shoot
*/

var player1 = {
    w : 30,
    h : 30,
    x : 50,
    y : 200,
    velx : 0,
    vely : 0,
    tToAcc: 1,
    dx : 0,
    dy : 0,
    shotTime : 0,
    shotCoolDown : 25,
    scale : 0,
    opacity : 1,
    dead : false,
    playerNum: 1,
    health: 10,
    takeDamage:true,
    damageC: 0,

    reset: function() {
        this.dead = false;
        this.health=10;
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

        var infoB = bullets.getMinInfo(this, "player" + this.playerNum);
        if (this.takeDamage && infoB.dist <= this.w+4) {
            infoB.object.remove = true;
            this.health-=1;
            this.takeDamage = false;
            if (this.health<=0) this.dead = true;
        }




        let c = Math.floor(wall.wallArr[0].length * this.x / canvas.width);
        let r = Math.floor(wall.wallArr.length * this.y / canvas.height);
        this.checkWall(r-1, c-1);
        this.checkWall(r-1, c);
        this.checkWall(r-1, c+1);
        this.checkWall(r, c-1);
        this.checkWall(r, c+1);
        this.checkWall(r+1, c-1);
        this.checkWall(r+1, c);
        this.checkWall(r+1, c+1);
    },

    rectCircleColliding : function(circle, rect) {
        var distX = Math.abs(circle.x - rect.x - rect.w / 2);
        var distY = Math.abs(circle.y - rect.y - rect.h / 2);

        if (distX > (rect.w / 2 + circle.r)) {
            return false;
        }
        if (distY > (rect.h / 2 + circle.r)) {
            return false;
        }

        if (distX <= (rect.w / 2)) {
            return true;
        }
        if (distY <= (rect.h / 2)) {
            return true;
        }
    },

    checkWall : function(r, c) {
        if (r < 0 || r >= wall.wallArr.length || c < 0 || c >= wall.wallArr[0].length) return;
        if (wall.wallArr[r][c] != 1) return;

        let wallW = canvas.width / wall.wallArr[0].length,
            wallH = canvas.height / wall.wallArr.length;

        let wallX = c * wallW, wallY = r * wallH;

        let circle = {
            x: this.x,
            y: this.y,
            r: this.w
        };

        let rect = {
            x: wallX,
            y: wallY,
            w: wallW,
            h: wallH
        };

        if (this.rectCircleColliding(circle, rect)==false)return;

        let offset = 0.5;
        if (this.x + this.w >= wallX && this.x + this.w <= wallX + wallW) {
            if (this.y+this.h >= wallY && this.y+this.h <= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching top left corner
                    this.x = wallX - this.w/2;
                    this.y = wallY - this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY - this.h-offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX - this.w-offset;
            } else if (this.y-this.h >= wallY && this.y-this.h<= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching bottom left corner
                    this.x = wallX - this.w/2;
                    this.y = wallY + wallH+this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY + wallH+this.h+offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX - this.w-offset;
            }
        } else if (this.x - this.w >= wallX && this.x - this.w <= wallX + wallW) {
            if (this.y+this.h >= wallY && this.y+this.h <= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching top right corner
                    this.x = wallX + wallW + this.w/2;
                    this.y = wallY - this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY - this.h-offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX + wallW + this.w+offset;
            } else if (this.y-this.h >= wallY && this.y-this.h<= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching bottom right corner
                    this.x = wallX + wallW + this.w/2;
                    this.y = wallY + wallH+this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY + wallH+this.h+offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX + wallW + this.w+offset;
            }
        }






    },

    die : function() {
        if (player1.opacity <= 0) {
            player1.opacity = 0;
            gameState=lose;
        } else {
            player1.scale += 0.5;
            player1.opacity = (Math.floor(player1.opacity*100)-1)/100;
        }
    },

    render : function() {
        drawCircle(player1.x, player1.y, player1.w+player1.scale, (this.playerNum==1)?"red":"blue", player1.opacity);
    },


    checkShoot : function() {
        var jx = 0, jy = 0;

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

        
        database.ref().child("PVP-Room/"+roomidPVP+"/Player" +((numPlayers==2)?1:3)+"/Shoot").once("value").then((p2) => {
            var c = 0;
            p2.forEach((dir) => {
                c++;
                if (dir.key == "dx") {
                    jx = dir.val();
                } else if (dir.key == "dy") {
                    jy = dir.val();
                }
                if (c == 2) {
                    var hyp = Math.sqrt(jx*jx + jy*jy);
                    if (hyp != 0 && this.shotTime >= this.shotCoolDown) {
                        this.shotTime = 0;
                        bullets.push({
                            x: this.x,
                            y: this.y,
                            angle: 0, //in radians
                            v: 8,
                            origin: "player1"
                        }, (jx / hyp), jy / hyp);
                    }
                    this.shotTime++;
                }
            });
        });
        
    },

    updateV : function(callback) {
            database.ref().child("PVP-Room/"+roomidPVP+"/Player1/Move").once("value").then((p1) => {
                var c = 0;
                p1.forEach((d) => {
                    c++;
                    if (d.key == "dx") {
                        this.dx = d.val();
                    } else if (d.key == "dy") {
                        this.dy = d.val();
                    }
                    if (c == 2) callback && callback();
                });
            });
        },

    update : function() {
        if (this.dead) {
            this.die();
            return;
        }

        if (this.takeDamage==false) {
            this.opacity-=0.05;
            if (this.opacity <= 0.31) this.opacity=0.8;
            this.damageC++;
            if (this.damageC >= 100) {
                this.takeDamage = true;
                this.damageC = 0;
                this.opacity = 1;
            }
        }

        this.drawHealthBar();

        
        this.checkShoot();
        
        this.updateV(() => {
            var maxXSpeed = Math.abs(this.dx) /jRadius * speed;
            var maxYSpeed = Math.abs(this.dy) / jRadius * speed;
            var accX = maxXSpeed / this.tToAcc;
            var accY = maxYSpeed / this.tToAcc;
            if (this.dx > 0) {
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
            player1.velx *= friction;
            player1.vely *= friction;
            player1.x += player1.velx;
            player1.y += player1.vely;
            this.checkCollision();
        });
        
    },

    drawHealthBar : function() {
        var kw = canvas.width;
        var scaledWidth = kw/10;
        var healthRatio = scaledWidth/10;
        context.fillStyle = "red";
        context.fillRect(80, canvas.height - 20, this.health * healthRatio, 10);
        context.strokeRect(80, canvas.height - 20, scaledWidth, 10);
        context.fillStyle = "black";
        context.font = "bold 15px Arial";
        context.fillText("Player 1", 10, canvas.height-11);
    }
};

var player2 = {
    w : 30,
    h : 30,
    x : 1400,
    y : 400,
    velx : 0,
    vely : 0,
    tToAcc: 1,
    dx : 0,
    dy : 0,
    shotTime : 0,
    shotCoolDown : 25,
    scale : 0,
    opacity : 1,
    dead : false,
    playerNum: 2,
    health: 10,
    takeDamage:true,
    damageC:0,

    reset: function() {
        this.dead = false;
        this.health=10;
        this.x=1000; this.y=200;
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

        var infoB = bullets.getMinInfo(this, "player" + this.playerNum);
        if (this.takeDamage && infoB.dist <= this.w+4) {
            infoB.object.remove = true;
            this.health-=1;
            this.takeDamage = false;
            if (this.health<=0) this.dead = true;
        }




        let c = Math.floor(wall.wallArr[0].length * this.x / canvas.width);
        let r = Math.floor(wall.wallArr.length * this.y / canvas.height);
        this.checkWall(r-1, c-1);
        this.checkWall(r-1, c);
        this.checkWall(r-1, c+1);
        this.checkWall(r, c-1);
        this.checkWall(r, c+1);
        this.checkWall(r+1, c-1);
        this.checkWall(r+1, c);
        this.checkWall(r+1, c+1);
        //this.checkWall(2, 1);
    },

    rectCircleColliding : function(circle, rect) {
        var distX = Math.abs(circle.x - rect.x - rect.w / 2);
        var distY = Math.abs(circle.y - rect.y - rect.h / 2);

        if (distX > (rect.w / 2 + circle.r)) {
            return false;
        }
        if (distY > (rect.h / 2 + circle.r)) {
            return false;
        }

        if (distX <= (rect.w / 2)) {
            return true;
        }
        if (distY <= (rect.h / 2)) {
            return true;
        }
    },

    checkWall : function(r, c) {
        if (r < 0 || r >= wall.wallArr.length || c < 0 || c >= wall.wallArr[0].length) return;
        if (wall.wallArr[r][c] != 1) return;

        let wallW = canvas.width / wall.wallArr[0].length,
            wallH = canvas.height / wall.wallArr.length;

        let wallX = c * wallW, wallY = r * wallH;

        let circle = {
            x: this.x,
            y: this.y,
            r: this.w
        };

        let rect = {
            x: wallX,
            y: wallY,
            w: wallW,
            h: wallH
        };

        if (this.rectCircleColliding(circle, rect)==false)return;

        let offset = 0.5;
        if (this.x + this.w >= wallX && this.x + this.w <= wallX + wallW) {
            if (this.y+this.h >= wallY && this.y+this.h <= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching top left corner
                    this.x = wallX - this.w/2;
                    this.y = wallY - this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY - this.h-offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX - this.w-offset;
            } else if (this.y-this.h >= wallY && this.y-this.h<= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching bottom left corner
                    this.x = wallX - this.w/2;
                    this.y = wallY + wallH+this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY + wallH+this.h+offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX - this.w-offset;
            }
        } else if (this.x - this.w >= wallX && this.x - this.w <= wallX + wallW) {
            if (this.y+this.h >= wallY && this.y+this.h <= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching top right corner
                    this.x = wallX + wallW + this.w/2;
                    this.y = wallY - this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY - this.h-offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX + wallW + this.w+offset;
            } else if (this.y-this.h >= wallY && this.y-this.h<= wallY+wallH) {
                if (!(this.y >= wallY && this.y <= wallY+wallH) && !(this.x >= wallX && this.x <= wallX+wallW)) {
                    //touching bottom right corner
                    this.x = wallX + wallW + this.w/2;
                    this.y = wallY + wallH+this.h/2;
                }
                if (!(this.y >= wallY && this.y <= wallY+wallH)) this.y = wallY + wallH+this.h+offset;
                if (!(this.x >= wallX && this.x <= wallX+wallW)) this.x = wallX + wallW + this.w+offset;
            }
        }






    },

    die : function() {
        if (player2.opacity <= 0) {
            player2.opacity = 0;
            gameState=lose;
        } else {
            player2.scale += 0.5;
            player2.opacity = (Math.floor(player2.opacity*100)-1)/100;
        }
    },

    render : function() {
        drawCircle(player2.x, player2.y, player2.w+player2.scale, (this.playerNum==1)?"red":"blue", player2.opacity);
    },


    checkShoot : function() {
        var jx = 0, jy = 0;

        database.ref().child("PVP-Room/"+roomidPVP+"/Player" +((numPlayers==2)?2:4)+"/Shoot").once("value").then((p2) => {
            var c = 0;
            p2.forEach((dir) => {
                c++;
                if (dir.key == "dx") {
                    jx = dir.val();
                } else if (dir.key == "dy") {
                    jy = dir.val();
                }
                if (c == 2) {
                    var hyp = Math.sqrt(jx*jx + jy*jy);
                    if (hyp != 0 && this.shotTime >= this.shotCoolDown) {
                        this.shotTime = 0;
                        bullets.push({
                            x: this.x,
                            y: this.y,
                            angle: 0, //in radians
                            v: 8,
                            origin: "player2"
                        }, (jx / hyp), jy / hyp);
                    }
                    this.shotTime++;
                }
            });
        });
        
    },

    updateV : function(callback) {
            database.ref().child("PVP-Room/"+roomidPVP+"/Player2/Move").once("value").then((p1) => {
                var c = 0;
                p1.forEach((d) => {
                    c++;
                    if (d.key == "dx") {
                        this.dx = d.val();
                    } else if (d.key == "dy") {
                        this.dy = d.val();
                    }
                    if (c == 2) callback && callback();
                });
            });
        },

    update : function() {
        if (this.dead) {
            this.die();
            return;
        }

        if (this.takeDamage==false) {
            this.opacity-=0.05;
            if (this.opacity <= 0.31) this.opacity=0.8;
            this.damageC++;
            if (this.damageC >= 100) {
                this.takeDamage = true;
                this.damageC = 0;
                this.opacity = 1;
            }
        }

        this.drawHealthBar();

        this.checkCollision();
        

        this.checkShoot();
        
        this.updateV(() => {
            var maxXSpeed = Math.abs(this.dx) /jRadius * speed;
            var maxYSpeed = Math.abs(this.dy) / jRadius * speed;
            var accX = maxXSpeed / this.tToAcc;
            var accY = maxYSpeed / this.tToAcc;
            if (this.dx > 0) {
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
            player2.velx *= friction;
            player2.vely *= friction;
            player2.x += player2.velx;
            player2.y += player2.vely;
            this.checkCollision();
        });
    },
    drawHealthBar : function() {
        var kw = canvas.width;
        var scaledWidth = kw/10;
        var healthRatio = scaledWidth/10;
        context.fillStyle = "blue";
        context.fillRect(kw-this.health*healthRatio-10, canvas.height - 20, this.health * healthRatio, 10);
        context.strokeRect(kw-10*healthRatio-10, canvas.height - 20, scaledWidth, 10);
        context.fillStyle = "black";
        context.font = "bold 15px Arial";
        context.fillText("Player 1", kw-10*healthRatio-80, canvas.height-11);
    }
};
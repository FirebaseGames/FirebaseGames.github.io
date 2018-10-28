function Bullets(){
    this.objects = [];
    this.maxID = 0;

    this.init = function(bullet, rX, rY){
        bullet.vx = bullet.v * rX;
        //Math.cos(bullet.angle);
        bullet.vy = bullet.v *rY;
        //Math.sin(bullet.angle);
    };
    this.push = function(bullet, rX, rY){

        this.init(bullet, rX, rY);

        var id = -1;
        //Search empty space
        while(this.objects[++id] != undefined);
        this.objects[id] = bullet;
        if(id > this.maxID) this.maxID = id;

    };

    this.update = function(){
        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;

            var obj = this.objects[i];

            obj.x += obj.vx;
            obj.y += obj.vy;
            //Detect if on screen
            if(
                obj.x < 0 || obj.y < 0 ||
                obj.x > canvas.width || obj.y > canvas.height ||
                obj.remove)
                delete this.objects[i];
            else {
                if(obj.origin=="player")
                drawCircle(obj.x, obj.y, 2, "black", 1);

                else if (obj.origin=="enemy"){
                    drawCircle(obj.x, obj.y, 4, "blue", 1);
                }

            }
        }
    };

    this.getSize = function(){
        var size = 0;
        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;
            size++;
        }
        return size;
    };

    this.getMinInfo = function(o, origin){
        var dist = 99999;
        var obj;
        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;
            if(this.objects[i].origin == origin) continue;

            var d = Math.sqrt(
                (o.x - this.objects[i].x)*(o.x - this.objects[i].x)+
                (o.y - this.objects[i].y)*(o.y - this.objects[i].y)
            );
            if(d < dist){
                dist = d;
                obj = this.objects[i];
            }
        }
        return {dist:dist,object:obj};
    };

}

function SpreadShot(){
    this.objects = [];
    this.maxID = 0;

    this.init = function(spreadshot, xFinal, yFinal){
        spreadshot.vx = (xFinal-spreadshot.x) / 150;
        spreadshot.vy = (yFinal-spreadshot.y) / 150;
        spreadshot.xFinal = xFinal;
        spreadshot.yFinal = yFinal;
    };

    this.push = function(spreadshot, x, y){
        this.init(spreadshot, x, y);

        var id = -1;
        //Search empty space
        while(this.objects[++id] != undefined);
        this.objects[id] = spreadshot;
        if(id > this.maxID) this.maxID = id;

    };

    this.update = function(){
        if (player.dead) return;

        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;

            var obj = this.objects[i];

            obj.x += obj.vx;
            obj.y += obj.vy;

            if (Math.abs(obj.x-obj.xFinal) <= Math.abs(obj.vx) &&
                Math.abs(obj.y-obj.yFinal)<= Math.abs(obj.vy)) {
                var bSpeed = 3;
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, 1, 0);
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, 0, 1);
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, -1, 0);
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, 0, -1);
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, 1/Math.sqrt(2), -1/Math.sqrt(2));
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, -1/Math.sqrt(2), 1/Math.sqrt(2));
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, 1/Math.sqrt(2), 1/Math.sqrt(2));
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:bSpeed,
                    origin: "enemy"
                }, -1/Math.sqrt(2), -1/Math.sqrt(2));

                delete this.objects[i];
            }

            //Detect if on screen
            if(
                obj.x < 0 || obj.y < 0 ||
                obj.x > canvas.width || obj.y > canvas.height ||
                obj.remove)
                delete this.objects[i];
            else {
                drawCircle(obj.x, obj.y, 30, "blue", 1);
            }
        }
    };

    this.getMinInfo = function(o){
        var dist = 99999;
        var obj;
        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;

            var d = Math.sqrt(
                (o.x - this.objects[i].x)*(o.x - this.objects[i].x)+
                (o.y - this.objects[i].y)*(o.y - this.objects[i].y)
            );
            if(d < dist){
                dist = d;
                obj = this.objects[i];
            }
        }
        return {dist:dist,object:obj};
    };
}

function ChasingEnemy() {
    this.objects = [];
    this.maxID = 0;

    this.init = function(chasing){
        chasing.opacity = 1;
        chasing.health = 3;
        chasing.time = 0;
        chasing.v = 2;
    };

    this.push = function(chasing){
        this.init(chasing);

        var id = -1;
        //Search empty space
        while(this.objects[++id] != undefined);
        this.objects[id] = chasing;
        if(id > this.maxID) this.maxID = id;

    };

    this.update = function(){
        if (player.dead) return;

        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;

            var obj = this.objects[i];

            var xToP = player.x - obj.x;
            var yToP = player.y - obj.y;
            var hyp = Math.sqrt(xToP * xToP + yToP * yToP);
            var dx = xToP * obj.v / hyp;
            var dy = yToP * obj.v / hyp;

            obj.x += dx;
            obj.y += dy;



            if (obj.time >= 80) {
                obj.time = 0;
                bullets.push({
                    x:obj.x,
                    y:obj.y,
                    v:3,
                    origin:"enemy"
                }, xToP/hyp, yToP/hyp);
            }
            obj.time++;



            var infoB = bullets.getMinInfo(obj, "enemy");
            if (infoB.dist <= 27) {
                obj.health--;
                infoB.object.remove = true;
            }

            if (obj.health==2) obj.opacity = 0.7;
            else if (obj.health==1) obj.opacity = 0.3;
            else if (obj.health<=0) delete this.objects[i];


            drawCircle(obj.x, obj.y, 25, "#fc4f46", obj.opacity);

        }
    };

    this.getMinInfo = function(o){
        var dist = 99999;
        var obj;
        for(var i = 0;i <= this.maxID;i++){
            if(this.objects[i] == undefined) continue;

            var d = Math.sqrt(
                (o.x - this.objects[i].x)*(o.x - this.objects[i].x)+
                (o.y - this.objects[i].y)*(o.y - this.objects[i].y)
            );
            if(d < dist){
                dist = d;
                obj = this.objects[i];
            }
        }
        return {dist:dist,object:obj};
    };
}
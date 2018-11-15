function Bullets(){
    this.objects = [];
    this.maxID = 0;

    this.reset = function() {
        this.maxID = 0;
        this.objects = [];
    },

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

    this.pushAngle = function(bullet, angle) {
        bullet.vx = bullet.v * Math.cos(angle);
        bullet.vy = bullet.v * Math.sin(angle);

        var id = -1;
        //Search empty space
        while(this.objects[++id] != undefined);
        this.objects[id] = bullet;
        if(id > this.maxID) this.maxID = id;
    };

    this.update = function(){
        if (player1.dead || player2.dead) return;
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
                if(obj.origin=="player1")
                    drawCircle(obj.x, obj.y, 2, "red", 1);

                else if (obj.origin=="player2"){
                    drawCircle(obj.x, obj.y, 2, "blue", 1);
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
        return {dist:dist,object:obj, touching: (o==undefined||obj==undefined)?false:this.rectCircleColliding({
                x:obj.x,
                y: obj.y,
                r: 2
            }, {
                x: o.x,
                y: o.y,
                h: o.h,
                w: o.w
            })};
    };

    this.rectCircleColliding = function(circle, rect) {
        var distX = Math.abs(circle.x - rect.x);
        var distY = Math.abs(circle.y - rect.y);

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
    };


}
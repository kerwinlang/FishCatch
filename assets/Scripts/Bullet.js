
cc.Class({
    extends: cc.Component,

    properties: {
        sprite : cc.Sprite ,
        hits : 10,//10攻击力，同样地，消耗10金币
    },


    shootTo(touchPos){
        // cc.log("____ touchPos = ",touchPos);

        let srcPos = this.node.getPosition()
        // cc.log("srcPos = " , srcPos);
        let dir = touchPos.sub(srcPos);
        // cc.log("dir = ",dir);
        let r =  Math.atan2(dir.y , dir.x); 
        //弧度转角度
        let degree = r * 180 / Math.PI;
        //数学的角度跟UI的角度相差90度
        this.node.angle = degree - 90

        //注意：math.sin 和 math.cos 函数的参数是以弧度为单位的，不是度！！！
        this.vx = this.speed * Math.cos(r);
        this.vy = this.speed * Math.sin(r);
        

    },


    onLoad () {
        this.speed  = 400;
        this.canMove = true;
    },

    start () {
    },

    onCollisionEnter: function (other, self){
        cc.log("bullet 碰撞到鱼了...");
        this.canMove = false;
        this.bulletPool.put(this.node)
    },

    unuse : function(){},

    reuse : function(bulletPool){
        this.bulletPool = bulletPool;
    },

    init(){
        this.node.position = cc.v2(0,0);
        this.canMove = true;
    },

    update (dt) {
        if(! this.canMove){
            return;
        }
        var sx = this.vx * dt;
        var sy = this.vy * dt;
        this.node.x += sx;
        this.node.y += sy;

        //当子弹完全移出屏幕的时候删除子弹
        if(this.node.x <= -cc.winSize.width * 0.5 || this.node.x >= cc.winSize.width * 0.5
            || this.node.y <= 0 || this.node.y >= cc.winSize.height){
                cc.log("子弹移除屏幕了，删除子弹");
                this.canMove = false;
                this.bulletPool.put(this.node)
        }

    },
});

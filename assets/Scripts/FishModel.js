
cc.Class({
    extends: cc.Component,

    properties: {
        road_index : 0,
        speed : 10000,
        life : 5,
        gold : 5
    },


    onLoad () {
        this.map = null;
        this.isMoving = false;
    },

    start () {
        this.playAnimation();//播放当前鱼动画
    },

    unuse : function(){},

    reuse : function(fishPool){
        this.fishPool = fishPool;
    },

    onCollisionEnter: function (other, self){
        cc.log("fish 被炮弹击中了...");
        this.isMoving = false;

        this.scheduleOnce(function(){
            this.fishPool.put(this.node);
        }.bind(this),1);
        
    },

    init(){
        this.node.position = cc.v2(0,0);
        this.isMoving = false;
    },

    playAnimation () {
        let ani = this.node.getComponent(cc.Animation);
        let animState = ani.play();
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },

    setFishMap(map){
        this.map = map;
    },

    fishMove(){
        //鱼开始移动
        if(! this.map){
            return ;//未设置roadmap，鱼无法移动
        }

        var road_set = this.map.get_road_set();
        // cc.log("road_set.length = " , road_set.length);
        //设置一个随机路径
        this.road_index = Math.floor(Math.random() * 30);//*30的这个数字是我随便设置的，理论上应该跟项目中设计了多少条路径有关

        // this.road_index = 16;//测试用，需删除

        if(this.road_index < 0){
            this.road_index = 0;
        }else if (this.road_index >= road_set.length){
            this.road_index = road_set.length - 1;
        }
        this.road_data = road_set[this.road_index];
        this.moveOnRoad();
    },

    moveOnRoad(){
        // cc.log("move on road....");
        if(this.road_data.length < 2){
            return ;
        }
        // cc.log("this.road_data = ",this.road_data)
        // this.node.position(this.road_data[0]);
        this.node.setPosition(this.road_data[0]);
        this.next_step = 1;//下一个点
        this.moveToNext();

    },

    beganMoveOnRoad(){
        this.node.setPosition(this.road_data[0]);
        this.next_step = 1;//下一个点
        this.moveToNext();
    },

    moveToNext(){
        if(this.next_step >= this.road_data.length){
            this.isMoving = false;
            this.life--;
            if(this.life <= 0){
                // cc.log("fish destroy");
                // this.node.destroy();

                // cc.log("fish结束使命，被添加到pool中");
                this.fishPool.put(this.node);
                // cc.log("this.fishPool.size() = " , this.fishPool.size());
            }
            this.fishMove();
            return
        }
        this.isMoving = true;
        var src = this.node.getPosition();
        var dst = this.road_data[this.next_step];
        var dir = dst.sub(src);
        var len = dir.mag();

        this.walk_time = len / this.speed;
        this.passed_time = 0;
        this.vx = this.speed * dir.x / len;
        this.vy = this.speed * dir.y / len;

        //调整鱼头位置
        var r = Math.atan2(dir.y , dir.x);//弧度
        var degree = r * 180 / Math.PI;
        degree = 360 - degree + 90;
        //this.node.rotation = degree;
        //用动画来做鱼头转弯
        this.node.stopAllActions();
        var rot = cc.rotateTo(0.1,degree);
        this.node.runAction(rot);
    },


    update (dt) {
        if(this.isMoving === false){
            return;
        }
        this.passed_time += dt;
        if(this.passed_time > this.walk_time){
            dt -= (this.passed_time - this.walk_time);
        }

        var sx = this.vx * dt;
        var sy = this.vy * dt;
        this.node.x += sx;
        this.node.y += sy;

        if(this.passed_time >= this.walk_time){
            this.next_step++;
            this.moveToNext();
        }
    },

});

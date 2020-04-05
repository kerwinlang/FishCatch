
cc.Class({
    extends: cc.Component,

    properties: {
        cannonPre : [cc.Prefab],
        bulletPre : [cc.Prefab],
        bombEffPre : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        let touchCallback = function(){
            cc.log("touchCallback fire");

            //this.cannonType  的值 [1,this.bulletPre.length]
            if(!this.cannonType || !this.bulletPre || this.cannonType < 1 || this.cannonType > this.bulletPre.length){
                return;
            }
            // cc.log(this.node.width , this.node.height);

            let bulletPool = this.bulletTypePools[this.cannonType];
            let bullet = null;
            if(bulletPool.size() > 0){
                bullet = bulletPool.get(bulletPool);
            }else{
                bullet = cc.instantiate(this.bulletPre[this.cannonType - 1])
            }
            bullet.parent = this.node;
            bullet.zIndex = -1;

            bullet = bullet.getComponent("Bullet");
            bullet.init();
            bullet.shootTo(this.touchPos);

        }.bind(this);

        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            // cc.log("touch start");
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            // cc.log("touch move");
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.touchPos = touchPos;
            // this.cannonScript.setTouchPos(touchPos,touchCallback);
            this.cannonScript.shootTo(touchPos,touchCallback)

        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            // cc.log("touch cancel");
        }.bind(this));


        //初始化bulletPool
        {
            this.bulletTypeCount = 2;//两种炮弹规格
            this.bPoolLimitCount = 50;//每个pool中bullet节点数量为50个
            this.bulletTypePools = [];
            for(let i = 0 ; i < this.bulletTypeCount ; i++){
                let bulletPool = new cc.NodePool("Bullet");
                for(let j = 0 ; j < this.bPoolLimitCount ; j++){
                    let bullet = cc.instantiate(this.bulletPre[i]);
                    bulletPool.put(bullet);
                }
                this.bulletTypePools[i+1] = bulletPool;
            }
    
        }


    },

    reduceCannon(){
        //减炮
        cc.log("减炮");
    },
    addCannon(){
        //加炮
        cc.log("加炮");
    },


    createCannonByType(type){
        //type 的值 [1,this.cannonPre.length]
        if(!type || type < 1 || type > this.cannonPre.length){
            return;
        }

        if(this.cannon){
            this.cannon.destroy();
            this.cannon = null;
            this.cannonScript = null;
        }

        let cannon = cc.instantiate(this.cannonPre[type-1])
        cannon.parent = this.node;
        cannon.name = "CANNON";
        this.cannon = cannon;
        this.cannonScript = cannon.getComponent("Cannon");
        // this.cannonScript.setCannonTypeAndBullePrefabs(type,this.bulletPre);
        // this.cannonScript.setBulletParent(this.node);//用this.node作为炮弹的父节点


    },

    start () {
        //炮的类型
        this.cannonType = 1;

        this.createCannonByType(this.cannonType);
    },

    // update (dt) {},
});

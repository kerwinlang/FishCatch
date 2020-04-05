// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // cannonRoot : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.node.on(cc.Node.EventType.TOUCH_START,function(event){
        //     let cannon = this.cannonRoot.getChildByName("CANNON");
        //     let cannonScript = cannon.getComponent("Cannon");

        //     let srcPos = this.node.convertToWorldSpaceAR(cc.v2(this.cannonRoot.x,this.cannonRoot.y));

        //     let touchPos = event.getLocation();
        //     cc.log("touchpos = " , touchPos );
        //     cc.log("srcPos = " , srcPos);
        //     let dir = touchPos.sub(srcPos);
        //     let r = dir.y / dir.x ;
        //     let degree = r * 180 / Math.PI - 90;
        //     cc.log("degree = " , degree);


                        
            
        //     cannonScript.setCannonAngle(degree);
    

        // }.bind(this));
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){

        // }.bind(this));

        // this.node.on(cc.Node.EventType.TOUCH_END,function(event){

        // }.bind(this));

    },

    start () {

        cc.debug.setDisplayStats(false);

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;


        var s = [];
        function foo(){
            for(var i = 0 ; i < 3 ; i++){
                s[i] = function(index){
                    return function(){
                        cc.log(index);
                    }
                }(i);
            }
        }

        foo();
        s[0]();
        s[1]();
        s[2]();

    },

    // update (dt) {},
});

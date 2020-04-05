
cc.Class({
    extends: cc.Component,

    properties: {


    },

    shootTo(touchPos,callback){
        this.callback = callback;
        let srcPos = this.node.getPosition()
        let dir = touchPos.sub(srcPos);
        let r =  Math.atan2(dir.y , dir.x); 
        let degree = r * 180 / Math.PI - 90;
        this.node.angle = degree
        this.node.zIndex = 2;

        if(this.callback){
            this.callback();
        }
    },


    addTouchListener () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){

        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            this.canClick = true;
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END,function(){
            if(!this.canClick){
                return;
            }
            this.canClick = false;
            this.scheduleOnce(function(){
                this.canClick = true;
            }.bind(this),this.clickInterval);
        }.bind(this));
    },

    onLoad () {
        this.addTouchListener();
    },

    start () {

        this.clickInterval = 5.0;
        this.canClick = true;

    },

    update (dt) {

    },
});


var map_gen = require("./common/fish_map")
// var FishModel = require("FishModel")
import {FISH_WEIGHT} from "Config"
cc.Class({
    extends: cc.Component,

    properties: {
        map : {
            type : map_gen,
            default : null,
        },

        fishPre : [cc.Prefab],
        interval : 1,//生成鱼 的间隔
        
    },

    // LIFE-CYCLE CALLBACKS:



    //根据权重获取对应的鱼类型
    getFishTypeByWeight () {
        let weights = 0;
        for (const key in FISH_WEIGHT) {
            // cc.log("key  = " , key);
            if (FISH_WEIGHT.hasOwnProperty(key)) {
                weights += FISH_WEIGHT[key];
            }
        }
        let randomNum = Math.random() * weights
        let curTotal = 0;
        let res = null;
        for (const key in FISH_WEIGHT) {
            if (FISH_WEIGHT.hasOwnProperty(key)) {
                curTotal += FISH_WEIGHT[key]
                if(curTotal >= randomNum){
                    res = key;
                    break;
                }
                
            }
        }
        return res;

    },

    onLoad () {
        // let result = {}
        // for(let i = 0 ; i < 100000 ; i++){
        //     let k = this.getFishTypeByWeight()
        //     if(! result[k]){
        //         result[k] = 0;
        //     }
        //     result[k] += 1;
        // }
        // cc.log("result = " , result);

        this.fishTotalCount = 100,//总鱼数
        this.poolLimitCount = 50,//每个对象池中对象数量

        this.fishTypePool = [];
        for(var i = 0 ; i < this.fishPre.length ; i++){
            let fishPool = new cc.NodePool("FishModel");
            for(let j = 1 ; j <= this.poolLimitCount ; j++){
                let fish = cc.instantiate(this.fishPre[i]);
                fishPool.put(fish);
            }
            this.fishTypePool[i+1] = fishPool;
        }

        // cc.log("this.fishTypePool  = " , this.fishTypePool);

    },

    //随机创建鱼
    createFishRandom(){

        //这个生成鱼类型的函数 可以设计个权重系列 ，根据权重来生成鱼
        let ftype =  this.getFishTypeByWeight();
        ftype = !ftype ? 1 : ftype;
        // cc.log("ftype = " , ftype);

        // ftype = 1;//测试用，需删除

        let fishPool = this.fishTypePool[ftype];
        let fishView = null;
        if(fishPool.size() > 0){
            // cc.log("pool中还有节点，复用");
            fishView = fishPool.get(fishPool);
        }else{
            // cc.log("pool中没有所需类型的节点，需重新创建");
            fishView = cc.instantiate(this.fishPre[ftype-1]);
            fishPool.put(fishView);
        }
        
        fishView.parent = this.node;
        let fishScript = fishView.getComponent("FishModel");
        fishScript.setFishMap(this.map);
        fishScript.fishMove();//鱼开始游动
    },


    start () {
        this.schedule(function(){
            // cc.log("this.node.childrenCount = " , this.node.childrenCount);
            if(this.node.childrenCount >= this.fishTotalCount){
                return;
            }
            // cc.log("1");
            this.createFishRandom()
        }.bind(this),this.interval);

    },

    update (dt) {

    },
});

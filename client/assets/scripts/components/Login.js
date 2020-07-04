//场景三 login场景 登录

//处理服务器发过来的 自己定义的一些格式
String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this; 
    } 
};
 
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _mima:null,
        _mimaIndex:0,
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.utils.setFitSreenMode();
        cc.vv.http.url = cc.vv.http.master_url;
        cc.vv.net.addHandler('push_need_create_role',function(){        //新用户进入 服务器返回该消息 要客户端创建一个角色
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");                        //进入下一个场景
        });
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];
        
        if(!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS){
            cc.find("Canvas/btn_yk").active = true;
            cc.find("Canvas/btn_weixin").active = false;
        }
        else{
            cc.find("Canvas/btn_yk").active = false;
            cc.find("Canvas/btn_weixin").active = true;
        }
    },
    
    start:function(){
        var account =  cc.sys.localStorage.getItem("wx_account");//localstorage 本地登录信息存储
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if(account != null && sign != null && account != '' && sign != ''){
            var ret = {
                errcode:0,
                account:account,
                sign:sign
            }
            cc.vv.userMgr.onAuth(ret);
        }   
    },
    
    //新用户需要先点击登录按钮 游客登录
    onBtnQuickStartClicked:function(){
        cc.vv.userMgr.guestAuth();
    },
    
    //原生平台接微信客户端会换成微信登录
    onBtnWeichatClicked:function(){
        var self = this;
        cc.vv.anysdkMgr.login();
    },
    
    onBtnMIMAClicked:function(event){
        if(this._mima[this._mimaIndex] == event.target.name){
            this._mimaIndex++;
            if(this._mimaIndex == this._mima.length){
                cc.find("Canvas/btn_yk").active = true;
            }
        }
        else{
            console.log("oh ho~~~");
            this._mimaIndex = 0;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

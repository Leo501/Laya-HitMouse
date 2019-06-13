var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var HammerMgr_1 = require("./manger/HammerMgr");
var GameMouseLayer_1 = require("./layer/GameMouseLayer");
var GameScene_1 = require("./scene/GameScene");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
        reg("manger/HammerMgr.ts", HammerMgr_1.default);
        reg("layer/GameMouseLayer.ts", GameMouseLayer_1.default);
        reg("scene/GameScene.ts", GameScene_1.default);
    };
    GameConfig.width = 1136;
    GameConfig.height = 640;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Scene/GameMain.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();

},{"./layer/GameMouseLayer":3,"./manger/HammerMgr":4,"./scene/GameScene":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    };
    Main.prototype.onConfigLoaded = function () {
        //加载IDE指定的场景
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
    };
    return Main;
}());
//激活启动类
new Main();

},{"./GameConfig":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameLayer = /** @class */ (function (_super) {
    __extends(GameLayer, _super);
    function GameLayer() {
        var _this = _super.call(this) || this;
        _this.mouseArr = [];
        _this.skis = ['ui/mouse_normal_1.png', 'ui/mouse_normal_2.png'];
        return _this;
    }
    GameLayer.prototype.onEnable = function () {
    };
    GameLayer.prototype.onStart = function () {
        this.mouseBirthAI();
    };
    GameLayer.prototype.mouseBirthAI = function () {
        var id = (Math.random() * 9 + 1) | 0;
        var type = (Math.random() * 2) | 0;
        if (!this.mouseArr[id]) {
            this.mouseArr[id] = this.mousCreateById(id, type);
        }
        var mouse = this.mouseArr[id];
        this.mouseUpAnim(mouse);
        Laya.timer.once(3000, this, this.mouseDownAnim, [mouse]);
    };
    GameLayer.prototype.mousCreateById = function (id, type) {
        var mouseItem = this.owner.getChildByName('mouseItem_' + id);
        var bg = mouseItem.getChildByName('bg');
        var mouse = new Laya.Image(this.skis[type]);
        mouse.alpha = 0;
        bg.addChild(mouse);
        return mouse;
    };
    GameLayer.prototype.mouseUpAnim = function (celler) {
        Laya.Tween.to(celler, { alpha: 1 }, 100);
        Laya.Tween.to(celler, { y: -23 }, 200, Laya.Ease.linearIn, null, 100);
        // console.log(anim);
    };
    GameLayer.prototype.stopMouseDownAnim = function () {
        Laya.timer.clear(this, this.mouseDownAnim);
    };
    GameLayer.prototype.mouseDownAnim = function (celler) {
        var _this = this;
        Laya.Tween.to(celler, { y: 0 }, 200);
        Laya.Tween.to(celler, { alpha: 0 }, 100, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
            _this.mouseBirthAI();
        }), 200);
    };
    GameLayer.prototype.onDisable = function () {
    };
    return GameLayer;
}(Laya.Script));
exports.default = GameLayer;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListenerManger_1 = require("../manger/ListenerManger");
var HannerMgr = /** @class */ (function (_super) {
    __extends(HannerMgr, _super);
    function HannerMgr() {
        return _super.call(this) || this;
    }
    HannerMgr.prototype.onEnable = function () {
        ListenerManger_1.ListenerMgr.Instance().on('onHammerHit', this, this.onHammerPlay);
        ListenerManger_1.ListenerMgr.Instance().on('onHammerMove', this, this.onHammerMove);
    };
    HannerMgr.prototype.onStart = function () {
        var effect = Laya.Pool.getItemByCreateFun("HammnerAnim", this.createAnim, this);
        this.owner.addChild(effect);
        this.hammer = effect;
        this.hammer.play(0, false);
        this.hammer.pos(-100, -100);
    };
    HannerMgr.prototype.onHammerPlay = function () {
        this.hammer && this.hammer.play(0, false);
    };
    HannerMgr.prototype.onHammerMove = function (pos) {
        this.hammer && this.hammer.pos(pos.x, pos.y);
    };
    HannerMgr.prototype.createAnim = function () {
        var resPath = "Anims/Hammer.ani";
        var ani = new Laya.Animation();
        ani.loadAnimation(resPath);
        return ani;
    };
    HannerMgr.prototype.onMouseDown = function (data) {
        this.onHammerPlay();
    };
    HannerMgr.prototype.onMouseMove = function (data) {
        this.onHammerMove(new Laya.Point(data.stageX, data.stageY));
    };
    HannerMgr.prototype.onDisable = function () {
        ListenerManger_1.ListenerMgr.Instance().offAllCaller(this);
    };
    return HannerMgr;
}(Laya.Script));
exports.default = HannerMgr;

},{"../manger/ListenerManger":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListenerMgr = /** @class */ (function (_super) {
    __extends(ListenerMgr, _super);
    function ListenerMgr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListenerMgr.Instance = function () {
        return this.instance;
    };
    ListenerMgr.instance = new Laya.EventDispatcher();
    return ListenerMgr;
}(Laya.EventDispatcher));
exports.ListenerMgr = ListenerMgr;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this) || this;
    }
    GameScene.prototype.onEnable = function () {
    };
    GameScene.prototype.onStart = function () {
    };
    GameScene.prototype.onDisable = function () {
    };
    return GameScene;
}(Laya.Script));
exports.default = GameScene;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL01haW4udHMiLCJzcmMvbGF5ZXIvR2FtZU1vdXNlTGF5ZXIudHMiLCJzcmMvbWFuZ2VyL0hhbW1lck1nci50cyIsInNyYy9tYW5nZXIvTGlzdGVuZXJNYW5nZXIudHMiLCJzcmMvc2NlbmUvR2FtZVNjZW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdHQUFnRztBQUNoRyxnREFBMEM7QUFDMUMseURBQW1EO0FBQ25ELCtDQUF5QztBQUN6Qzs7RUFFRTtBQUNGO0lBYUk7SUFBYyxDQUFDO0lBQ1IsZUFBSSxHQUFYO1FBQ0ksSUFBSSxHQUFHLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDN0MsR0FBRyxDQUFDLHFCQUFxQixFQUFDLG1CQUFTLENBQUMsQ0FBQztRQUNyQyxHQUFHLENBQUMseUJBQXlCLEVBQUMsd0JBQWMsQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBQyxtQkFBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQWxCTSxnQkFBSyxHQUFRLElBQUksQ0FBQztJQUNsQixpQkFBTSxHQUFRLEdBQUcsQ0FBQztJQUNsQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLFlBQVksQ0FBQztJQUMvQixpQkFBTSxHQUFRLFFBQVEsQ0FBQztJQUN2QixpQkFBTSxHQUFRLFFBQVEsQ0FBQztJQUN2QixxQkFBVSxHQUFLLHNCQUFzQixDQUFDO0lBQ3RDLG9CQUFTLEdBQVEsRUFBRSxDQUFDO0lBQ3BCLGdCQUFLLEdBQVMsS0FBSyxDQUFDO0lB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LENBQUMsQ0FBQztRQUMzQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksSUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksSUFBZ0I7UUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsNkJBQVMsR0FBVDtRQUNJLDRCQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDTCxnQkFBQztBQUFELENBN0NBLEFBNkNDLENBN0NzQyxJQUFJLENBQUMsTUFBTSxHQTZDakQ7Ozs7OztBQzdDRDtJQUFpQywrQkFBb0I7SUFBckQ7O0lBUUEsQ0FBQztJQUppQixvQkFBUSxHQUF0QjtRQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBSmMsb0JBQVEsR0FBeUIsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFNL0Usa0JBQUM7Q0FSRCxBQVFDLENBUmdDLElBQUksQ0FBQyxlQUFlLEdBUXBEO0FBUlksa0NBQVc7Ozs7O0FDQXhCO0lBQXVDLDZCQUFXO0lBRTlDO2VBQWdCLGlCQUFPO0lBQUUsQ0FBQztJQUUxQiw0QkFBUSxHQUFSO0lBRUEsQ0FBQztJQUVELDJCQUFPLEdBQVA7SUFFQSxDQUFDO0lBRUQsNkJBQVMsR0FBVDtJQUVBLENBQUM7SUFDTCxnQkFBQztBQUFELENBZkEsQUFlQyxDQWZzQyxJQUFJLENBQUMsTUFBTSxHQWVqRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IEhhbW1lck1nciBmcm9tIFwiLi9tYW5nZXIvSGFtbWVyTWdyXCJcbmltcG9ydCBHYW1lTW91c2VMYXllciBmcm9tIFwiLi9sYXllci9HYW1lTW91c2VMYXllclwiXG5pbXBvcnQgR2FtZVNjZW5lIGZyb20gXCIuL3NjZW5lL0dhbWVTY2VuZVwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xMTM2O1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9NjQwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJob3Jpem9udGFsXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cIm1pZGRsZVwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJjZW50ZXJcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOmFueT1cIlNjZW5lL0dhbWVNYWluLnNjZW5lXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICB2YXIgcmVnOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcclxuICAgICAgICByZWcoXCJtYW5nZXIvSGFtbWVyTWdyLnRzXCIsSGFtbWVyTWdyKTtcbiAgICAgICAgcmVnKFwibGF5ZXIvR2FtZU1vdXNlTGF5ZXIudHNcIixHYW1lTW91c2VMYXllcik7XG4gICAgICAgIHJlZyhcInNjZW5lL0dhbWVTY2VuZS50c1wiLEdhbWVTY2VuZSk7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5jbGFzcyBNYWluIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQpO1xyXG5cdFx0ZWxzZSBMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHJcblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHR9XHJcblxyXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cclxuXHRcdEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUxheWVyIGV4dGVuZHMgTGF5YS5TY3JpcHQge1xyXG5cclxuICAgIHByaXZhdGUgbW91c2VBcnIgPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHNraXMgPSBbJ3VpL21vdXNlX25vcm1hbF8xLnBuZycsICd1aS9tb3VzZV9ub3JtYWxfMi5wbmcnXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG4gICAgfVxyXG5cclxuICAgIG9uU3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5tb3VzZUJpcnRoQUkoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZUJpcnRoQUkoKSB7XHJcbiAgICAgICAgbGV0IGlkID0gKE1hdGgucmFuZG9tKCkgKiA5ICsgMSkgfCAwO1xyXG4gICAgICAgIGxldCB0eXBlID0gKE1hdGgucmFuZG9tKCkgKiAyKSB8IDA7XHJcbiAgICAgICAgaWYgKCF0aGlzLm1vdXNlQXJyW2lkXSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlQXJyW2lkXSA9IHRoaXMubW91c0NyZWF0ZUJ5SWQoaWQsIHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbW91c2UgPSB0aGlzLm1vdXNlQXJyW2lkXTtcclxuXHJcbiAgICAgICAgdGhpcy5tb3VzZVVwQW5pbShtb3VzZSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDMwMDAsIHRoaXMsIHRoaXMubW91c2VEb3duQW5pbSwgW21vdXNlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW91c0NyZWF0ZUJ5SWQoaWQsIHR5cGUpIHtcclxuICAgICAgICBsZXQgbW91c2VJdGVtID0gdGhpcy5vd25lci5nZXRDaGlsZEJ5TmFtZSgnbW91c2VJdGVtXycgKyBpZCk7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IG1vdXNlSXRlbS5nZXRDaGlsZEJ5TmFtZSgnYmcnKTtcclxuICAgICAgICBsZXQgbW91c2UgPSBuZXcgTGF5YS5JbWFnZSh0aGlzLnNraXNbdHlwZV0pO1xyXG4gICAgICAgIG1vdXNlLmFscGhhID0gMDtcclxuICAgICAgICBiZy5hZGRDaGlsZChtb3VzZSk7XHJcbiAgICAgICAgcmV0dXJuIG1vdXNlO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlVXBBbmltKGNlbGxlcikge1xyXG4gICAgICAgIExheWEuVHdlZW4udG8oY2VsbGVyLCB7IGFscGhhOiAxIH0sIDEwMCk7XHJcbiAgICAgICAgTGF5YS5Ud2Vlbi50byhjZWxsZXIsIHsgeTogLTIzIH0sIDIwMCwgTGF5YS5FYXNlLmxpbmVhckluLCBudWxsLCAxMDApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuaW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BNb3VzZURvd25BbmltKCkge1xyXG4gICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcywgdGhpcy5tb3VzZURvd25BbmltKVxyXG4gICAgfVxyXG5cclxuICAgIG1vdXNlRG93bkFuaW0oY2VsbGVyKSB7XHJcbiAgICAgICAgTGF5YS5Ud2Vlbi50byhjZWxsZXIsIHsgeTogMCB9LCAyMDApO1xyXG4gICAgICAgIExheWEuVHdlZW4udG8oY2VsbGVyLCB7IGFscGhhOiAwIH0sIDEwMCwgTGF5YS5FYXNlLmxpbmVhckluLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3VzZUJpcnRoQUkoKTtcclxuICAgICAgICB9KSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBMaXN0ZW5lck1nciB9IGZyb20gXCIuLi9tYW5nZXIvTGlzdGVuZXJNYW5nZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhhbm5lck1nciBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuXHJcbiAgICBwcml2YXRlIGhhbW1lcjogTGF5YS5BbmltYXRpb247XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cclxuXHJcbiAgICBvbkVuYWJsZSgpOiB2b2lkIHtcclxuICAgICAgICBMaXN0ZW5lck1nci5JbnN0YW5jZSgpLm9uKCdvbkhhbW1lckhpdCcsIHRoaXMsIHRoaXMub25IYW1tZXJQbGF5KTtcclxuICAgICAgICBMaXN0ZW5lck1nci5JbnN0YW5jZSgpLm9uKCdvbkhhbW1lck1vdmUnLCB0aGlzLCB0aGlzLm9uSGFtbWVyTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdGFydCgpIHtcclxuICAgICAgICBsZXQgZWZmZWN0ID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNyZWF0ZUZ1bihcIkhhbW1uZXJBbmltXCIsIHRoaXMuY3JlYXRlQW5pbSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5vd25lci5hZGRDaGlsZChlZmZlY3QpO1xyXG4gICAgICAgIHRoaXMuaGFtbWVyID0gZWZmZWN0O1xyXG4gICAgICAgIHRoaXMuaGFtbWVyLnBsYXkoMCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuaGFtbWVyLnBvcygtMTAwLCAtMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkhhbW1lclBsYXkoKSB7XHJcbiAgICAgICAgdGhpcy5oYW1tZXIgJiYgdGhpcy5oYW1tZXIucGxheSgwLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25IYW1tZXJNb3ZlKHBvczogTGF5YS5Qb2ludCkge1xyXG4gICAgICAgIHRoaXMuaGFtbWVyICYmIHRoaXMuaGFtbWVyLnBvcyhwb3MueCwgcG9zLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUFuaW0oKTogTGF5YS5BbmltYXRpb24ge1xyXG4gICAgICAgIGxldCByZXNQYXRoID0gXCJBbmltcy9IYW1tZXIuYW5pXCI7XHJcbiAgICAgICAgbGV0IGFuaTogTGF5YS5BbmltYXRpb24gPSBuZXcgTGF5YS5BbmltYXRpb24oKTtcclxuICAgICAgICBhbmkubG9hZEFuaW1hdGlvbihyZXNQYXRoKTtcclxuICAgICAgICByZXR1cm4gYW5pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKGRhdGE6IExheWEuRXZlbnQpIHtcclxuICAgICAgICB0aGlzLm9uSGFtbWVyUGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlKGRhdGE6IExheWEuRXZlbnQpIHtcclxuICAgICAgICB0aGlzLm9uSGFtbWVyTW92ZShuZXcgTGF5YS5Qb2ludChkYXRhLnN0YWdlWCwgZGF0YS5zdGFnZVkpKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKTogdm9pZCB7XHJcbiAgICAgICAgTGlzdGVuZXJNZ3IuSW5zdGFuY2UoKS5vZmZBbGxDYWxsZXIodGhpcyk7XHJcbiAgICB9XHJcbn0iLCJcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0ZW5lck1nciBleHRlbmRzIExheWEuRXZlbnREaXNwYXRjaGVyIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBuZXcgTGF5YS5FdmVudERpc3BhdGNoZXIoKTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlKCk6IExpc3RlbmVyTWdyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgXHJcbn0iLCJpbXBvcnQgeyBMaXN0ZW5lck1nciB9IGZyb20gXCIuLi9tYW5nZXIvTGlzdGVuZXJNYW5nZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVTY2VuZSBleHRlbmRzIExheWEuU2NyaXB0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoKTsgfVxyXG5cclxuICAgIG9uRW5hYmxlKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBvblN0YXJ0KCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCk6IHZvaWQge1xyXG5cclxuICAgIH1cclxufSJdfQ==

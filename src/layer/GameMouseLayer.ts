export default class GameLayer extends Laya.Script {

    private mouseArr = [];

    private skis = ['ui/mouse_normal_1.png', 'ui/mouse_normal_2.png'];

    constructor() { super(); }

    onEnable(): void {
    }

    onStart() {
        this.mouseBirthAI();
    }

    mouseBirthAI() {
        let id = (Math.random() * 9 + 1) | 0;
        let type = (Math.random() * 2) | 0;
        if (!this.mouseArr[id]) {
            this.mouseArr[id] = this.mousCreateById(id, type);
        }
        let mouse = this.mouseArr[id];

        this.mouseUpAnim(mouse);
        Laya.timer.once(3000, this, this.mouseDownAnim, [mouse]);
    }

    mousCreateById(id, type) {
        let mouseItem = this.owner.getChildByName('mouseItem_' + id);

        let bg = mouseItem.getChildByName('bg');
        let mouse = new Laya.Image(this.skis[type]);
        mouse.alpha = 0;
        bg.addChild(mouse);
        return mouse;
    }

    mouseUpAnim(celler) {
        Laya.Tween.to(celler, { alpha: 1 }, 100);
        Laya.Tween.to(celler, { y: -23 }, 200, Laya.Ease.linearIn, null, 100);
        // console.log(anim);
    }

    stopMouseDownAnim() {
        Laya.timer.clear(this, this.mouseDownAnim)
    }

    mouseDownAnim(celler) {
        Laya.Tween.to(celler, { y: 0 }, 200);
        Laya.Tween.to(celler, { alpha: 0 }, 100, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
            this.mouseBirthAI();
        }), 200);
    }

    onDisable(): void {
    }
}
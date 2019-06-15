export default class GameTopPanel extends Laya.Script {

    private chanceTime: Laya.ProgressBar;

    private gameScore: Laya.Box;

    constructor() { super(); }

    onEnable(): void {
    }

    onStart() {
        this.chanceTime = this.owner.getChildByName('chanceTime') as Laya.ProgressBar;
        this.gameScore = this.owner.getChildByName('score') as Laya.Box;

        this.initUI();
    }

    initUI() {
        this.setChanceTime(1);
        this.setGameScore(100);
    }


    setChanceTime(numb: number) {
        this.chanceTime.value = numb;
    }

    setGameScore(score: number) {
        let data = {};
        for (let i = 9; i > -1; i--) {
            data[`num${i}`] = { index: score % 10 };
            score /= 10;
        }
        this.gameScore.dataSource = data;
    }

    onDisable(): void {
    }
}
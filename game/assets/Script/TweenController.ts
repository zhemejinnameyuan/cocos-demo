import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
import DateUtil from '../Utils/DateUtil';
const { ccclass, property } = _decorator;

@ccclass('TweenController')
export class TweenController extends Component {

    start() {
        //缓动系统
        let tweenDuration: number = 3.0;
        tween(this.node).delay(1.0).to(
            tweenDuration,
            { position: new Vec3(123, 123, 0) },
            {
                easing: "linear",
            }).start();

            let time = DateUtil.getTime()
            console.log(time)
            let timeFormat = DateUtil.formatFullTime(time)
            console.log(timeFormat)
    }

    update(deltaTime: number) {

    }
}


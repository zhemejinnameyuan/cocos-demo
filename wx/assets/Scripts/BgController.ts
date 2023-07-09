import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgController')
export class BgController extends Component {
    start() {

    }

    update(deltaTime: number) {
        //遍历背景,实现滚动背景
        for (let bgNode of this.node.children) {
            let p = bgNode.getPosition();
            p.y -= 50 * deltaTime;
            if(p.y < -850){
                p.y += 852*2
            }
            bgNode.position = p;
        }

    }
}


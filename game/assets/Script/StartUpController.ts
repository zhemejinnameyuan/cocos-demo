import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUpController')
export class StartUpController extends Component {
    start() {
        //初始化,日志开关
        CLogger.init('info')

    }

    update(deltaTime: number) {
        
    }
}


import { _decorator, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainController')
export class MainController extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    submitLogin(){ 
        let parent = this.node.getParent().getChildByName('username').getComponent(EditBox).string
        console.log(parent)
    }
}


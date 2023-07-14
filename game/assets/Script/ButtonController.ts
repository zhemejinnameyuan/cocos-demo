import { _decorator, Component, director, Node } from 'cc'; 
const { ccclass, property } = _decorator;


@ccclass('ButtonController')
export class ButtonController extends Component {
    start() {

        
    }

    update(deltaTime: number) {

    }

    click(event, customData :string) { 
        const Logger = CLogger.getLogger()
    
        Logger.info("this is info")
        Logger.warn("this is warn")
        Logger.error("this is error")
 
        console.log(customData)
        switch (customData) {
            case 'startUp':
                director.loadScene('startUp')
                break
            case 'startGame':
                director.loadScene('game')
                break
        }
 
    }
}


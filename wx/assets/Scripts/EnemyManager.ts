import { _decorator, Component, director, instantiate, macro, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    //敌机预设体
    @property(Prefab)
    enemyPrefab: Prefab = null


    start() {
        //每隔2s,创建一个敌机
        this.schedule(() => {
            let enemyNode = instantiate(this.enemyPrefab)
            //设置父物体
            enemyNode.parent = director.getScene().getChildByName('Canvas')
            let position = this.node.getPosition()

            let x = Math.random() * 400
            enemyNode.setPosition(x, position.y, 0)

        }, 2, macro.REPEAT_FOREVER, 0)

    }

    update(deltaTime: number) {

    }
}


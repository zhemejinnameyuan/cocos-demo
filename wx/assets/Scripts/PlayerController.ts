import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, find, instantiate, IPhysics2DContact, macro, NodeEventType, PhysicsSystem2D, Prefab } from 'cc';
import { EnemyController } from './EnemyController';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null
    start() {
        let self = this

        this.node.on(NodeEventType.TOUCH_MOVE, (event) => {
            //移动飞机
            let position = event.getUILocation()
            this.node.setWorldPosition(position.x, position.y, 0)
        })

        //攻击计时器
        this.schedule(() => {
            //创建子弹
            let bulletNode = instantiate(this.bulletPrefab)
            //设置父物体
            bulletNode.parent = director.getScene().getChildByName('Canvas')
            let position = this.node.getPosition()
            bulletNode.setPosition(position.x, position.y + 60, 0)
        }, 0.2, macro.REPEAT_FOREVER, 0)

        //碰撞检测
        let collider = this.getComponent(BoxCollider2D);
        if (collider) { 
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次

        if(otherCollider.tag === 1){
            //敌机撞上玩家飞机,显示gameover
           find('Canvas/gameover').active = true

           //关闭定时器
           this.closeBulletSchedule()

           //关闭触摸事件
           this.node.off(NodeEventType.TOUCH_MOVE)

           //关闭敌机定时器
           find('Canvas/EnemyManager').getComponent(EnemyManager).closeBulletSchedule()
        }
    }
 
    //关闭定时器
    closeBulletSchedule(){
        this.unscheduleAllCallbacks()
    }

    gameOver(){
        
    }

    update(deltaTime: number) {


    }
}


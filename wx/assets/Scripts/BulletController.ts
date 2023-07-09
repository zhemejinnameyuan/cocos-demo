import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property
    speed: number = 800

    start() {
        //碰撞检测
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact,this);
        }

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        //碰到敌人,让敌人死人,销毁自己
        // console.log('bullet:' + otherCollider.tag);
        if (otherCollider.tag === 1) {
            otherCollider.getComponent(EnemyController).die()

            this.getComponent(BoxCollider2D).enabled = false

            setTimeout(() => {
                this.node.destroy()
            }, 1000);

        }
    }

    update(deltaTime: number) {
        // console.log('子弹移动')
        //移动子弹
        let p = this.node.getPosition();
        p.y += this.speed * deltaTime
        this.node.position = p
        //出屏幕销毁
        if (this.node.y > 820) {
            this.node.destroy()
        }
    }

}


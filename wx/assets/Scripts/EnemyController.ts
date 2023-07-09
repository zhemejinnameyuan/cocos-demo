import { _decorator, assert, BoxCollider, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, PhysicsSystem2D, resources, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    //是否死亡
    isDie: boolean = false
    start() {
        //碰撞检测
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    //敌机移动
    update(deltaTime: number) {
        if (!this.isDie) {
            let p = this.node.getPosition();
            p.y -= 100 * deltaTime
            this.node.position = p
            //出屏幕销毁
            if (this.node.y < 820) {
                this.node.destroy()
            }
        }
    }

    //碰撞监听
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('enemy:' + otherCollider.tag);
    }


    //碰撞死亡
    die() {
        resources.load('images/airplane3/spriteFrame', (err, res) => {
            // console.log(res)
            this.node.getComponent(Sprite).spriteFrame = res

            this.isDie = true
            //关闭碰撞检测
            this.getComponent(BoxCollider2D).enabled = false
            setTimeout(() => {
                this.node.destroy()
            }, 1000)
        })


    }
}



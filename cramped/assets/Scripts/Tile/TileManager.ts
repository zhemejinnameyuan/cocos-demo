import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

const TILE_WIDTH = 55
const TILE_HEIGHT = 55

/**
 * 单个瓦片管理
 */
@ccclass('TileManager')
export class TileManager extends Component {
    start() {

    }

    init(spriteFrame:SpriteFrame,i:number,j:number){
        const sprite = this.addComponent(Sprite) 
        sprite.spriteFrame = spriteFrame

        const transform = this.addComponent(UITransform)
        transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)

        this.node.setPosition(i * TILE_WIDTH,-j*TILE_HEIGHT)
    }

    update(deltaTime: number) {
        
    }
}


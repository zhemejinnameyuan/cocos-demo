import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator; 
import { createUINode } from '../../Utils';
import { TileManager } from './TileManager'; 
import { DataManager } from '../../Runtime/DataManager';


@ccclass('TileMapManager')
export class TileMapManager extends Component {
    start() {

    }

    async init() {
        const mapInfo = DataManager.instance<DataManager>().mapInfo
        const spriteFrames = await this.loadRes()
        //循环处理地图信息
        for (let i = 0; i < mapInfo.length; i++) {
            const cloum = mapInfo[i];
            for (let j = 0; j < cloum.length; j++) {
                const item = cloum[j];
                if (item.src === null || item.type === null) {
                    continue
                }
                const imgSrc = `tile (${item.src})`
                const node = createUINode()
                const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
                const tileManager = node.addComponent(TileManager)
                tileManager.init(spriteFrame, i, j)

                node.setParent(this.node)
            }
        }
    }

    /**
     * 加载瓦片图片资源
     */
    loadRes() {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir('texture/tile/tile', SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(spriteFrame)
            })

        })
    }

    update(deltaTime: number) {

    }
}


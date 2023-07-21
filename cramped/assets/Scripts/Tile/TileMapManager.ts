import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator; 
import { createUINode } from '../../Utils';
import { TileManager } from './TileManager'; 
import { DataManager } from '../../Runtime/DataManager';
import { ResourceManager } from '../../Runtime/ResourceManager';


@ccclass('TileMapManager')
export class TileMapManager extends Component {
    start() {

    }

    async init() {
        //获取地图信息
        const mapInfo = DataManager.instance<DataManager>().mapInfo
        //加载瓦片图片资源
        console.log(ResourceManager.instance<ResourceManager>().title)
        const spriteFrames =  ResourceManager.instance<ResourceManager>().loadDir('texture/tile/tile',SpriteFrame)
 
        
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

 

    update(deltaTime: number) {

    }
}


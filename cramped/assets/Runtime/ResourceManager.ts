import { SpriteFrame, resources } from "cc"
import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"

export class ResourceManager extends Singleton {
 
    /** 构造函数 */
    protected constructor() {
        super()
    }

    /** 创建对象 */
    protected static create(...args: any[]): ResourceManager {
        return new ResourceManager()
    }

    /** 加载资源 */
    loadDir(path: string, type: typeof SpriteFrame = SpriteFrame){
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, type, function (err, assets) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(assets)
            })

        })
    }
}

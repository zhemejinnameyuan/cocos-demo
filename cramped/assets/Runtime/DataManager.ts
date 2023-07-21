import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"

export class DataManager extends Singleton{
    mapInfo:Array<Array<ITile>>
    mapRowCount:number
    mapCloumnCount:number
}
 
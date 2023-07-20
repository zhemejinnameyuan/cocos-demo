import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { DataManagerInterface } from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;
const TILE_WIDTH = 55
const TILE_HEIGHT = 55

@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel

    stage:Node

    start() {
        this.generateStage()
        this.initLevel()
    }

    initLevel(){
        const level = levels['level1']
        if(level){
            this.level = level

            DataManagerInterface.mapInfo = this.level.mapInfo
            DataManagerInterface.mapRowCount = this.level.mapInfo.length || 0
            DataManagerInterface.mapCloumnCount = this.level.mapInfo[0].length || 0
            this.generateTileMap()
        }
    }

    generateStage(){
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }

    generateTileMap(){
      
        const tileMap = createUINode()
        tileMap.setParent(this.stage)

        const tileMapManager = tileMap.addComponent(TileMapManager)

        tileMapManager.init()

        this.adaptPos()
    }

    adaptPos(){
        const {mapRowCount,mapCloumnCount} = DataManagerInterface
        const disX = TILE_WIDTH * mapRowCount / 2
        const disY = TILE_HEIGHT * mapCloumnCount / 2
        this.stage.setPosition(-disX+20,disY+100)

    }

    update(deltaTime: number) {
        
    }
}


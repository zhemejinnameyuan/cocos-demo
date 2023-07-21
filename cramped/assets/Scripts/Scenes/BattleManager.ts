import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../Utils';
import levels, { ILevel } from '../../Levels';
import { DataManagerInterface } from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;
const TILE_WIDTH = 55
const TILE_HEIGHT = 55

/**
 * 战斗控制器
 */
@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel

    stage:Node

    start() {
        this.generateStage()
        this.initLevel()
    }

    /**
     * 初始化地图配置
     */
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

    /**
     * 生成瓦片地图节点
     */
    generateStage(){
        this.stage = createUINode()
        this.stage.setParent(this.node)
    }

    /**
     * 生成瓦片地图
     */
    generateTileMap(){
        const tileMap = createUINode()
        tileMap.setParent(this.stage)
        const tileMapManager = tileMap.addComponent(TileMapManager)
        tileMapManager.init()
        this.adaptPos()
    }

    /**
     * 地图居中
     */
    adaptPos(){
        const {mapRowCount,mapCloumnCount} = DataManagerInterface
        const disX = TILE_WIDTH * mapRowCount / 2
        const disY = TILE_HEIGHT * mapCloumnCount / 2
        this.stage.setPosition(-disX+20,disY+100)
    }

    update(deltaTime: number) {
        
    }
}


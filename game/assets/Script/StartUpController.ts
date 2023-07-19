import { _decorator, AudioClip, AudioSource, Button, Component, find, Node, resources, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartUpController')
export class StartUpController extends Component {

    public audio = null

    //当前是否播放背景音乐
    public playBgMusic:Boolean = true
 
    start() {
        //初始化,日志开关
        CLogger.init('info')

        this.audio = this.node.getComponent(AudioSource)
        this.audio.play()

      
    }

    setBgVolume(res) {
        this.audio.volume = res._progress
    }

    //背景音乐关闭/开启
    bgMusicSwitch(event){
        let buttonNode = find('Canvas/bg/musicSwitch').getComponent(Button)
       

        if(!this.playBgMusic){
            //开启
            this.playBgMusic = true
            this.audio.play()

            resources.load('images/login/setting',SpriteAtlas,(error,SpriteAtlas)=>{            
                buttonNode.normalSprite =SpriteAtlas.spriteFrames.setting6
            })
        }else{
            //关闭
            this.playBgMusic = false
            this.audio.stop()
            resources.load('images/login/setting',SpriteAtlas,(error,SpriteAtlas)=>{            
                buttonNode.normalSprite =SpriteAtlas.spriteFrames.setting5
            })
        }
    }

    update(deltaTime: number) {

    }
}


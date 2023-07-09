import { _decorator, assert, AudioSource, Component, director, EditBox, find, Node, NodeEventType, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoginController')
export class LoginController extends Component {

    
    @property
    text:string = 'hello'

    @property(AudioSource) 
    _audioSource: AudioSource = null!;

    start() {
        console.log('start')
      // 获取 AudioSource 组件
      const audioSource = this.node.getComponent(AudioSource)!;
      // 检查是否含有 AudioSource，如果没有，则输出错误消息
      assert(audioSource);
      // 将组件赋到全局变量 _audioSource 中
      this._audioSource = audioSource;

      this.node.on(NodeEventType.MOUSE_DOWN,function(event:Event){
        console.log('aaaa')
      })



    }

    update(deltaTime: number) { 
    }

    submitLogin(){ 

        this.play()

        let parent = this.node.getParent().getChildByName('username').getComponent(EditBox).string
        console.log(find('Canvas/username').getComponent(EditBox).string)

        // find('Canvas/username').active = false
        find('Canvas/username').getComponent(EditBox).string=this.text


        //进入场景
        // director.loadScene("scene");
    }



    play () {
        // 播放音乐
        this._audioSource.play();
    }

    pause () {
        // 暂停音乐
        this._audioSource.pause();
    }
}


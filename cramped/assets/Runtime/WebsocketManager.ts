/**
 * 服务器通讯消息管理
 */

import Singleton from "../Base/Singleton";
import WebSocketClient from "../Utils/WebSocketClient";

const Logger = console

export default class WebsocketManager extends Singleton {
    /** ws */
    private _wsClient: WebSocketClient;
    /** 创建对象 */
    protected static create(...args: any[]): WebsocketManager {
        return new WebsocketManager()
    }

    /**  */
    public connectWebSocket(_address: string, onConnectSuccessed?: Function) {
        if (!this._wsClient) {
            this._wsClient = new WebSocketClient(this.onReceiveMessage.bind(this), this.onCloseSocket.bind(this))
        }
        !this.isConnected() && this._wsClient.connectWebSocket(_address, onConnectSuccessed)
    }

    /** 客户端主动关闭连接 */
    public closeWebsocket() {
        this._wsClient && this._wsClient.close()
    }
    /** socket是否连接 */
    public isConnected() {
        return this._wsClient && this._wsClient.isConnected()
    }


    /** 发送消息 */
    public sendMessage(buffer: any) {
        this._wsClient.sendMessage(buffer)
        console.log("发送消息:" + window.btoa(buffer))
    }



    /** 收到消息 */
    private onReceiveMessage(buffer: any) {
        if (!buffer) return
        console.log("收到消息:" + window.atob(buffer))
    }
    /**
     * 收到服务器关闭socket消息
     * @param is_waiting_connect 是否正在等待关闭完成后重新连接
     */
    private onCloseSocket(is_waiting_connect) {
        console.log("close")
    }
}



/** 监听 服务器socket返回的消息 */
export function RegisterCmdResponse(cmd_id: number, handle_func: Function) {
    isExistPb(cmd_id) && EventManager.on(`E_C_${cmd_id}`, handle_func, undefined, { cover: true })
}



const Logger = console
/**
 *  websocket封装
 */
export default class WebSocketClient {
    /** ip */
    private _address: string = "";
    /** 是否处于等待连接状态 */
    private _is_waiting_connect = false;
    /** 使连接保持活动状态 间隔时间 秒 */
    private static _keep_alive_time = 10
    /** 数据发送队列 */
    private _data_list: any[] = [];
    /** 正在连接中 */
    private connecting: boolean = false
    /** 连接超时定时器 */
    private connect_timer: any = undefined
    /** websocket具柄 */
    private _ws: WebSocket | null = null;
    /** 连接成功回调 */
    private _onConnectSuccessed: Function = null;
    /** 外部消息处理 */
    private _on_message_cb: (data: MessageEvent) => void = undefined;
    /** socket关闭 */
    private _on_close_cb: (...params: any) => void = undefined;

    /** 构造函数 */
    constructor(_on_message_cb: (data: MessageEvent) => void, _on_close_cb: (...params: any) => void) {
        this._on_message_cb = _on_message_cb
        this._on_close_cb = _on_close_cb
    }

    /** 开始连接 */
    public connectWebSocket(_address?: string, onConnectSuccessed?: Function) {
        if (this.connecting) return
        if (!_address && !this._address) {
            Logger.warn(`connect websocket faild. params error! _address[${_address}]`)
            return
        }
        if (_address) {
            this._address = _address
        }
        this.connecting = true
        this._onConnectSuccessed = onConnectSuccessed
        if (this._ws) {
            switch (this._ws.readyState) {
                case WebSocket.CLOSING:
                    this._is_waiting_connect = true;
                    return true
                case WebSocket.CLOSED:
                    this._ws = null;
                    return this._connect(this._address)
            }
        } else {
            return this._connect(this._address)
        }
    }

    /** 发送消息 */
    public sendMessage(msg_data: SocketBuffer) {
        if (!msg_data) return
        if (this._ws) {
            this._data_list.push(msg_data)
            if (this._ws.readyState === WebSocket.OPEN) {
                this._send_by_list()
            }
        } else if (this._is_waiting_connect) {
            this._data_list.push(msg_data)
        }
    }

    /** 是否连接成功 */
    public isConnected() {
        return !!this._ws && this._ws.readyState === WebSocket.OPEN
    }

    /** 是否是关闭状态 */
    public isClosed() {
        return !this._ws || this._ws.readyState === WebSocket.CLOSED
    }

    /** 客户端主动关闭连接 */
    public close() {
        // this.client_close_t = new Date().getTime()
        if (this._ws) {
            this.isConnected() && this._ws.close()
            this._data_list = []
            this._ws.onclose = undefined
            this._ws.onerror = undefined
            this._ws = undefined
        }
    }

    /** 开始创建连接 */
    private _connect(_address: string) {
        const fullUrl = _address
        try {
            this._ws = new WebSocket(fullUrl);
        } catch (error) {
            Logger.error("create websocket error!", error)
        }
        if (!this._ws) {
            Logger.warn("create websocket faild.", fullUrl)
            return
        }
        this.connect_timer = setTimeout(() => {
            this.connect_timer = undefined
            if (this._ws) {
                this._ws.onclose = undefined;
                this._ws.onerror = undefined;
                this._ws.readyState === WebSocket.OPEN && this._ws.close()
            }
            this._onError(new Event("websokcet connect timeout!"))
        }, 15 * 1000)
        this._ws.onopen = this._onConnected.bind(this)
        this._ws.onmessage = (message_event) => {
            if (message_event.data instanceof Blob) {
                /** h5 环境 BLOB类型转换为ArrayBuffer*/
                const reader = new FileReader();
                reader.readAsArrayBuffer(message_event.data);
                const that = this
                reader.onload = function (e) {
                    that._on_message_cb.apply(undefined, [this.result])
                }
            } else {
                this._on_message_cb.apply(undefined, [message_event.data])
            }
        }
        this._ws.onclose = this._onClose.bind(this)
        this._ws.onerror = this._onError.bind(this)

        return true
    }

    /** 连接成功回调 */
    private _onConnected(event: any) {
        this.connecting = false
        this.connect_timer && clearTimeout(this.connect_timer)
        this.connect_timer = undefined
        Logger.info(`websocket[${this._ws.url}]连接成功. state[${this._ws.readyState}]`)
        // setTimeout(()=>{
        this._send_by_list()
        // }, 0)
        this._onConnectSuccessed && this._onConnectSuccessed.apply(null, [true])
        this._onConnectSuccessed = undefined
    }

    /** socket关闭回调 */
    private _onClose(event: any) {
        this._data_list = []
        Logger.info("收到websocket连接关闭", this._ws.readyState)

        this._on_close_cb && this._on_close_cb(this._is_waiting_connect)
        //等待关闭后连接
        if (this._is_waiting_connect) {
            this._is_waiting_connect = false
            this._connect(this._address)
        }
    }

    /** 错误回调 */
    private _onError(event: any) {
        Logger.warn("websocket错误", event)
        this.connect_timer && clearTimeout(this.connect_timer)
        this.connect_timer = undefined
        if (!this.connecting) {
            this._onConnectSuccessed && this._onConnectSuccessed.apply(null, [false])
            this._onConnectSuccessed = undefined
        } else {
            this.connecting = false
        }
    }

    /** 队列发送消息 */
    private _send_by_list() {
        if (this._data_list.length < 1) return
        if (this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(this._data_list.shift())

            this._data_list.length > 0 && setTimeout(() => {
                this._send_by_list()
            }, 0)
        }

    }
}

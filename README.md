# Node-RED


## 全局启动

1. `npm install -g --unsafe-perm node-red`
2. `node-red`
3. Open <http://localhost:1880>

## 本地项目启动

1. `"start": "node red.js flows_.json --userDir"` --userDir 更改Node-RED数据存储目录 ，不同的 --userDir 会渲染不同的流程
2. 每次按“部署”按钮都会更新userDir中定义的文件
3. `"pm2": "pm2 start pm2.json "` pm2 自动开机启动
4. `$pm2 save -->> $pm2 startup`

## 添加节点
1. `npm install <npm-package-name>`

### 安装单个节点文件
通过将节点.js和.html 文件复制到nodes用户数据目录中的目录来安装节点

## 各种节点基本功能
一个节点最多可以有一个输入端口和多个输出端口。

“快速添加”对话框提供了一种简单的方法，可以将节点添加到鼠标所在的工作区，而无需将其从调色板中拖出。
单击工作区时按住Ctrl或Command键可打开该对话框。
#### "Inject节点" 注入节点
`msg.payload` 为时间戳。可以运行时自动注入以及循环调用

#### "Debug节点" 调试节点
在控制台或者命令行输出数据。可以输出完整数据对象，或者输出某一个数据payload，topic等

#### "Function节点" 功能节点
通过JavaScript函数传递每条消息。需要return 将数据传递到下一个节点。可以设置多个"输出"

详情:https://nodered.org/docs/writing-functions

#### "HttpRequest节点" http请求节点
可以设置get/post等方法

#### "CSV节点" 
可以将对象转换为csv,或者将csv转换成对象

#### "Switch节点" 
判断某一个属性的范围，如果为真则返回 msg.payload 

#### "Change节点" 
将传递过来的 msg 转换成字符数字json等


### context
节点 - 仅对设置值的节点可见

在Function 节点设置和获取上下文
```
// initialise the counter to 0 if it doesn't exist already
var count = context.get('count')||0;
count += 1;
// store the value back
context.set('count',count);
// make it part of the outgoing msg object
msg.count = count;
return msg;
```
每次运行count都会递增

### flow 
流 - 对同一流上的所有节点可见（或编辑器中的选项卡）

获取和设置整个流程的共有数据
```
flow.get(..) ：获取流范围的上下文属性
flow.set(..) ：设置流范围的上下文属性
flow.keys(..) ：返回所有流范围的上下文属性键的列表
```

### flow 
全局 - 所有节点都可见

获取和设置全部流程的共有数据
```
global.get(..) ：获取流范围的上下文属性
global.set(..) ：设置流范围的上下文属性
global.keys(..) ：返回所有流范围的上下文属性键的列表
```

### 修改节点状态
```
node.status({fill:"red",shape:"ring",text:"disconnected"});
node.status({fill:"green",shape:"dot",text:"connected"});
node.status({text:"Just text status"});
node.status({});   // to clear the status
```
 
 
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

### 登陆相关设置
在 setting.js 文件 adminAuth 中设置相关用户和权限，在user数组添加相关用户

* 生成密码哈希
  要生成合适的密码哈希，可以使用node-red-admin 命令行工具：
  `node-red-admin hash-pw`
  该工具将提示您输入要使用的密码，然后打印出可以复制到设置文件中的哈希。
  
* 用户权限
1. *完全访问权限
2. read - 只读访问权限
```
       {
           username: "read",
           password: "$2a$08$sheM.rOYBHCjOf7EILAZyeOnCnx5xWU/bmjOdOPtojASWF/jouuIa",
           permissions: "read"
       }
```
* 令牌到期
默认情况下，访问令牌在创建后7天后过期。我们目前不支持刷新令牌以延长此期限。

可以通过设置设置的sessionExpiryTime属性来自定义到期时间adminAuth。
```
adminAuth: {
    sessionExpiryTime: 86400, //一天
    ...
}
```

* 也可以定制用户认证
1. 编写自定义认证文件 `xxxx.js`
2. 设置adminAuth在settings.js属性来加载这个模块：`adminAuth: require("./user-authentication")`


## 各种节点基本功能
一个节点最多可以有一个输入端口和多个输出端口。

不同的msg.property 不会互相覆盖

“快速添加”对话框提供了一种简单的方法，可以将节点添加到鼠标所在的工作区，而无需将其从调色板中拖出。
单击工作区时按住Ctrl或Command键可打开该对话框。
#### "Inject节点" 注入节点
`msg.payload` 为时间戳。可以运行时自动注入以及循环调用

#### "Debug节点" 调试节点
在控制台或者命令行输出数据。可以输出完整数据对象，或者输出某一个数据payload，topic等

#### "Function节点" 功能节点
通过JavaScript函数传递每条消息。需要return 将数据传递到下一个节点。可以设置多个"输出"。

可以使用node.status({text:msg.payload});设置该节点状态

详情:https://nodered.org/docs/writing-functions

#### "HttpRequest节点" http请求节点
可以设置get/post等方法

#### "CSV节点" 
可以将对象转换为csv,或者将csv转换成对象

#### "Switch节点" 
判断某一个属性的范围，如果为真则返回 msg.payload 

#### "Change节点" 
将传递过来的 msg 设置成字符数字json等。也可以转换或删除某些属性

Change节点可用于设定消息的属性（设定上面的输入框为下面输入框的内容，“到”是“为”意思）

该节点支持设置各种JavaScript类型以及一些Node-RED特定类型。
* 字符串： "hello world"
* 数字： 42
* 布尔值：true/false
* timestamp：自纪元（1970年1月1日）以来的当前时间（以毫秒为单位）
* JSON：将被解析为其Object表示的JSON字符串
* Buffer：Node.js Buffer对象


#### "Range节点" 
用于在两个不同的数字范围之间线性缩放
> 此节点仅对数字有效

#### "http in" 节点和"http response"节点
创建一个http服务。以HTTP In节点开头的任何流都必须具有到HTTP Response节点的路径，否则请求最终会超时。

#### "http request节点"
向网站发出简单的GET请求并提取有用信息。可以通过上一个节点的msg.url设置地址。

可以在地址上面使用{{xxxx}},来获取上个节点设置的属性

可以通过*Function 节点*设置请求头
```
msg.payload = "data to post";
msg.headers = {};
msg.headers['X-Auth-User'] = 'mike';
msg.headers['X-Auth-Key'] = 'fred-key';
return msg;
```

#### "HTML节点"
HTML节点从检索到的html文档中提取元素,可是使用数组输出提取的元素

HTML节点中的选取项规则与css选择器一样

#### "json节点"
可以将JSON字符串与对象互转


#### "mqtt in 节点"与"mqtt out 节点"
- *"mqtt in 节点"* 为订阅。使用`sensors/#`可以订阅`sensors`主题级别下的所有消息
- *"mqtt out 节点"* 为发布。发布的主题可以不在"mqtt out节点"定义，可以在前一个节点中直接定义msg.topic

> 使用node-red-contrib-mqtt-broker 可以开启mqtt服务

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

### global 
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
 
 
## 创建节点

----
### 在全局 node-red 中创建节点（直接使用'$ node-red 开启服务'）

创建新的项目文件夹`lower-case`，文件夹里包括`package.json`,`lower-case.js`,`lower-case.html`
1. *package.json*

在package.json中添加下面代码
```
 "node-red" : {
        "nodes": {
            "lower-case": "lower-case.js"
        }
    }
```
这告诉运行时模块包含哪些节点文件。

2. *lower-case.js*
```
module.exports = function(RED) { 
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);  //初始化节点
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);//注册节点，要与html文件中的名称一致
}
```
2. *lower-case.html*
```
<script type="text/javascript">
     /**
     * js：RED.nodes.registerType("my-lower-case",LowerCaseNode);
     * 第二个参数就是{} 就是传入LowerCaseNode的配置参数
     * */
    RED.nodes.registerType('lower-case',{
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: {value:""}
        },
        inputs:1,
        outputs:1,
        icon: "file.png",
        label: function() {
            return this.name||"lower-case";
        }
    });
</script>


<!--data-template-name 双击节点弹出来的配置页面-->
<script type="text/x-red" data-template-name="my-lower-case">
    <div class="form-row">
        <label for="node-input-name"><i class="icon-tag"></i> Name</label>
        <input type="text" id="node-input-name" placeholder="Name">
    </div>
</script>

<!--data-help-name 点击节点侧边栏显示的帮助信息-->
<script type="text/x-red" data-help-name="my-lower-case">
    <p>A simple node that converts the message payloads into all my-lower-case characters</p>
</script>
```
* data-template-name 双击节点弹出来的配置页面
* data-help-name 点击节点侧边栏显示的帮助信息

最后在node-red全局目录安装依赖
`$ cd ~/.node-red`
`$ npm install E:\my-lower-case`

### 在开发环境创建节点 （使用'$ npm start'开启服务）
* 直接将上面的`lower-case.js`与`lower-case.html`拷贝至 `node/core`下面相应的目录即可。然后重启服务

### JavaScript文件

#### 节点构造函数
调用RED.nodes.createNode函数来初始化所有节点共享的功能
```
function SampleNode(config) {
    RED.nodes.createNode(this,config);
    // node-specific code goes here

}

RED.nodes.registerType("sample",SampleNode);
```
#### 接收消息
监听上一个节点传递过来的msg
```
this.on('input', function(msg) {
    // do something with 'msg'
});
```
#### 发送消息
向下一个节点传递信息
```
var msg = { payload:"hi" }
this.send(msg);
```

>如果节点有多个输出，则可以传递一组消息send，每个消息都被发送到相应的输出。```this.send([ msg1 , msg2 ]);```

#### 关闭节点
```
this.on('close', function() {
    // tidy up any state
});
```
异步关闭节点
```
this.on('close', function(done) {
    doSomethingWithACallback(function() {
        done();
    });
});
```

#### 记录事件
如果节点需要将某些内容记录到控制台，它可以使用以下功能之一：
```
this.log("Something happened");
this.warn("Something happened you should know about");
this.error("Oh no, something bad happened");

// Since Node-RED 0.17
this.trace("Log some internal detail not needed for normal operation");未知
this.debug("Log something more details for debugging the node's behaviour");未知
```

`this.log`不会在编辑器中显示，只会在命令行中显示。`this.warn`与`this.error`会在编辑器中显示

如果节点遇到应该暂停当前流的错误，它应该使用该this.error函数记录事件。

如果错误是节点的用户可能想要为自己处理的错误，则应使用原始消息（如果这是一个输入节点，则为空消息）调用该函数作为第二个参数：
`node.error("hit an error", msg);`
这将触发同一选项卡上显示的任何Catch节点。

#### 设置状态
在运行时，节点能够与编辑器UI共享状态信息。这是通过调用status函数来完成的：
```
this.status({fill:"red",shape:"ring",text:"disconnected"});
```

#### 常用```RED.util```

* RED.util.getMessageProperty(msg,node.property)
从msg中获取node.property中定义的属性

* ED.util.setMessageProperty(msg,node.property,value);
设置msg的node.property（payload）中定义的属性，即设置msg.payload属性值为value，可以设置不同msg.property,然后发送出去


### HTML文件
html 文件包含三个不同的部分，每个部分都包含在自己的<script>标记中。
> 使用jQuery

#### 定义节点
```
<script type="text/javascript">
    RED.nodes.registerType('node-type',{
        // node definition
    });
</script>
```
使用RED.nodes.registerType 功能向编辑器注册节点。
* 第一个参数为'节点类型',必须与js里面定义的一致。
* 第二个参数为'节点配置'对象

'节点配置'对象
* category:(字符串）节点出现的调色板类别。定义节点属于哪个类型，包括'input','output','function','config'等，

* defaults:( object）节点的可编辑属性。创建节点实例时传递给节点构造函数的属性。

defaults对象中的条目可以具有以下属性：
- value :(任何类型）属性采用的默认值
- required:( boolean）可选属性是否必需。如果设置为true，则如果属性值为null或为空字符串，则该属性将无效。
- validate:( function）可选的一个函数，可用于验证属性的值。
- type:( string）可选，如果此属性是指向配置节点的指针 ，则标识节点的类型。
1. 向defaults对象添加新条目：
```
defaults: {
            name: {value:""},
            prefix: {value:""},//新添加
            topic: {value:"",required:true,validate: RED.validators.regex(/^(#$|(\+|[^+#]*)(\/(\+|[^+#]*))*(\/(\+|#|[^+#]*))?$)/)},
            qos: {value: "2"},
            broker: {type:"mqtt-broker", required:true}
        },
```
2. 在节点的编辑模板中添加条目
```
 <div class="form-row">
     <label for="node-input-prefix"><i class="icon-tag"></i> Prefix</label>
     <input type="text" id="node-input-prefix">
 </div>
```
模板应包含<input>一个id设置为 的元素*node-input-<propertyname>*。
3. 使用节点中的属性
```
 function LowerCaseNode(config) {
     RED.nodes.createNode(this,config);//config里面可以直接使用defaults里面定义的属性
     this.prefix = config.prefix;
     var node = this;
     this.on('input', function(msg) {
         msg.payload = node.prefix + msg.payload.toLowerCase();
         node.send(msg);
     });
 }
```

* inputs:(数字）节点有多少输入，0或者1。
* outputs:(数字）节点有多少输出。可以是0或更多。
* color:(字符串）要使用的背景颜色。
* label：（string | function）工作空间中使用的标签。从侧边栏拖出来显示的名称。
* icon:(字符串）要使用的图标。
* oneditprepare 在显示对话框之前立即调用。
```
 oneditprepare: function() {
            if (this.qos === undefined) {//直接使用this.propertyname获取defaults中的属性
                $("#node-input-qos").val("2");
            }
        }
 oneditprepare: function() {
            if (this.property === undefined) {//直接通过this获取defaults中的property
                 $("#node-input-property").val("payload");
           }
           $("#node-input-property").typedInput({default:'msg',types:['msg']});
        }
```
`typedInput({default:'msg',types:['msg'] })` 替换常规<input>，允许选择值的类型，包括字符串，数字和布尔类型的选项。
- msg	一个msg.属性表达
- flow	一个flow.属性表达
- global	一个global.属性表达
- str	一个字符串
- num	一个号码
- bool	一个布尔值
- json	一个有效的JSON字符串
- bin	Node.js缓冲区
- re	正则表达式
- date	当前时间戳

* oneditsave 在编辑对话框正常时调用。
* oneditcancel 在取消编辑对话框时调用。
* oneditdelete 在按下配置节点的编辑对话框中的删除按钮时调用。
* oneditresize 调整编辑对话框大小时调用。

#### 编辑对话框 data-template-name
```
<script type="text/x-red" data-template-name="node-type">
    <div class="form-row">
        <label for="node-input-name"><i class="fa fa-tag"></i> Name</label>
        <input type="text" id="node-input-name" placeholder="Name">
    </div>
    <div class="form-tips"><b>Tip:</b> This is here to help.</div>
</script>
```
* 使用`form-row`定义一行
* 使用Font Awesome 定义图标
#### 帮助信息 data-help-name
将鼠标悬停在调色板中的节点上时，第一个<p>标记的内容将用作工具提示。

#### 在js文件中使用context
```
var nodeContext = this.context();

var flowContext = this.context().flow;

var globalContext = this.context().global;
```

#### 节点状态

```
this.status({fill:"red",shape:"ring",text:"disconnected"});

this.status({fill:"green",shape:"dot",text:"connected"});
```

### 配置节点(不显示在左侧边栏的节点)
某些节点需要共享配置。例如，MQTT In和MQTT Out节点共享MQTT代理的配置，允许它们汇集连接。配置节点默认为全局范围，这意味着将在流之间共享状态。

配置节点的定义方式与其他节点相同。有两个主要区别：
* 它的category属性设置为config
* 编辑模板<input>元素有idnode-config-input-<propertyname>

server.html
```
<script type="text/javascript">
    RED.nodes.registerType('remote-server',{
        category: 'config',
        defaults: {
            host: {value:"localhost",required:true},
            port: {value:1234,required:true,validate:RED.validators.number()},
        },
        label: function() {
            return this.host+":"+this.port; //可以直接使用defaults里的属性
        }
    });
</script>

<script type="text/x-red" data-template-name="remote-server">
    <div class="form-row">
        <label for="node-config-input-host"><i class="icon-bookmark"></i> Host</label>
        <input type="text" id="node-config-input-host">
    </div>
    <div class="form-row">
        <label for="node-config-input-port"><i class="icon-bookmark"></i> Port</label>
        <input type="text" id="node-config-input-port">
    </div>
</script>
```
server.js
```
module.exports = function(RED) {
    function RemoteServerNode(n) {
        RED.nodes.createNode(this,n);
        this.host = n.host;
        this.port = n.port;
    }
    RED.nodes.registerType("remote-server",RemoteServerNode);
}
```

* 在其它的节点使用配置节点
节点通过向defaults 数组添加属性来注册其对配置节点的使用，其type属性设置为配置节点的类型。
```
defaults: {
   server: {value:"", type:"remote-server"},
},
```
编辑器将此<input>元素替换<select>为使用配置节点的可用实例填充的元素，以及用于打开配置节点编辑对话框的按钮。
```
  <div class="form-row">
        <label for="node-input-broker"><i class="fa fa-globe"></i> <span data-i18n="mqtt.label.broker"></span></label>
        <input type="text" id="node-input-server">
    </div>
```

在其它的节点js文件中可以获取配置节点RED.nodes.getNode()
```
module.exports = function(RED) {
    function MyNode(config) {
        RED.nodes.createNode(this,config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        if (this.server) {
            // Do something with:
            //  this.server.host
            //  this.server.port
        } else {
            // No config node configured
        }
    }
    RED.nodes.registerType("my-node",MyNode);
}
```
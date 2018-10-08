/**
 * Created by Administrator on 2018/9/25.
 */
module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) { //每当消息到达节点时调用的事件注册一个监听器
            var value = RED.util.getMessageProperty(msg,node.name);
            msg.payload = msg.payload.toLowerCase();
            // this.error("hit an error", msg);
            node.send(msg); //调用该send函数以在流中传递消息
            this.log("Something happened");
            this.warn("Something happened you should know about");
            this.error("Oh no, something bad happened");
        });
        node.on('close', function(removed, done) {
            console.log('removed',removed)
            console.log('done',done)

            if (removed) {
                // This node has been deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("my-lower-case",LowerCaseNode);
}
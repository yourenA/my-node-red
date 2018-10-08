/**
 * Created by Administrator on 2018/9/10.
 */
var http = require('http');
var express = require("express");
var RED = require("node-red");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/red", //网页地址
    httpNodeRoot: "", //设置所有http 请求的前缀
    userDir:"./", //存储数据目录，当前目录，不用指定文件
    functionGlobalContext: { //设置global context
        flower:2
    }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(8001);

// Start the runtime
RED.start();
# node-red-dashboard
默认打开 http://localhost:1880/ui 

可以在右侧'dashboard'面板上配置页面的标题，主题，布局等

## layout
* 每一个tab表示一个页面
* 每一个link表示一个外部链接，可以在新页面打开，也可以使用iframe嵌套
* 每一个group表示一个页面里的某一个卡片，每个卡片可以设置宽度
> 上下拖动设置每一个页面或卡片的位置

## 仪表盘

* 曲线图，条形图，饼状图，雷达图数据
```
var m={};
m.labels = [10,20,30,40,50,60,70];//x轴
m.series = ['Series A', 'Series B', 'Series C', 'Series D'];//有几个系列
m.data = [  //每个系列的数据
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [38, 28, 20, 49, 45, 60, 20],
    [58, 18, 40, 29, 15, 30, 60]
  ];
return {payload:[m]}; //注意这里是要有payload以及payload是一个数组
```

# node-red-node-mysql

每个执行sql语句节点后面都需要连接"mysql 节点"，通过topic获取sql语句
### 使用"template 节点"执行sql语句
需要设定 msg.topic , 然后直接在模板里书写 sql 语句 

### 使用"function 节点"执行sql语句
```
var msg = {
 topic : "Select SPEED from WIND"     
 };
return msg;
```
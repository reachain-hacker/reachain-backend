// 存储服务
// var AV = require('leancloud-storage');
// 有了这一行，无需另外 require('leancloud-storage')
var AV = require('leancloud-storage/live-query');
var { Query, User } = AV;
AV.init({
    appId: "tuatIQNYBRO70Vngqs6kjWsd-9Nh9j0Va",
    appKey: "iY5alJzEMMfe5LfGjSN0ECN1",
    serverURLs: "https://tuatiqny.lc-cn-e1-shared.com",
  });
  
// 即时通讯服务
var { Realtime, TextMessage } = require('leancloud-realtime');

subscribe();

// save();

// destroy("5dc3ad79adfc9d0009d37264")

// fetch("5dc3ad79adfc9d0009d37264")

function destroy(id) {
    var todo = AV.Object.createWithoutData('Teacher', id);
    todo.destroy();
    console.log("destroy() teacher has been destroyed")
}

function fetch(id) {
    console.log("获取最新创建的Teacher with id => " + id)
    var query = new AV.Query('Teacher');
    query.get(id).then(function (new_teacher) {
        console.log(new_teacher.toJSON());
    });
}

function save() {
    var TestObject = AV.Object.extend('Teacher');
    var testObject = new TestObject();
    testObject.set('name', 'Hello world!');
    testObject.set('age', 123);
    testObject.save().then(function (testObject) {
        console.log('保存成功');
    });

}

function subscribe() {
    var query = new AV.Query('Teacher');
    query.subscribe().then(function (liveQuery) {
        console.log("事件訂閱成功");
        liveQuery.on('create', function (teacher) {
            console.log("有新teacher");
            console.log(teacher.toJSON());
        });

        liveQuery.on('delete', function (teacher) {
            console.log("有老师被删除");
            console.log(teacher.toJSON());
        });
    });
}


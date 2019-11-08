// 存储服务
// var AV = require('leancloud-storage');
// 有了这一行，无需另外 require('leancloud-storage')
var AV = require('leancloud-storage/live-query');
AV.init({
    appId: "tuatIQNYBRO70Vngqs6kjWsd-9Nh9j0Va",
    appKey: "iY5alJzEMMfe5LfGjSN0ECN1",
    serverURLs: "https://tuatiqny.lc-cn-e1-shared.com",
});

listMembers("5dc52e66f4f71d0008b65ef9")

// teach("5dc52aacf4f71d0008b65e6c", "First Lesson", "IT")

// learn("5dc53b69adfc9d0009d3a0e2", "5dc52e66f4f71d0008b65ef9")

// award("5dc52ffcadfc9d0009d39e57", "5dc52e66f4f71d0008b65ef9", 5)

// subscribe();

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

function fetchByField(table, field, value, equal = true) {
    var query = new AV.Query(table);
    equal ? query.equalTo(field, value) : query.notEqualTo(field, value)
    query.find().then(function (items) {
        console.log(items.toJSON());
        return items
    });
}

function findAllAndUpdateAll() {
    var query = new AV.Query('Teacher');
    query.find().then(function (teachers) {
        // 获取需要更新的 todo
        teachers.forEach(function (teacher) {
            // 更新属性值
            teacher.set('age', 10);
        });
        // 批量更新
        AV.Object.saveAll(teachers);
    });
}

function joinFetch() {
    var studentQuery = new AV.Query('Student');
    var countryQuery = new AV.Query('Country');
    // 获取所有的英语国家
    countryQuery.equalTo('language', 'English');
    // 把 Student 的 nationality 和 Country 的 name 关联起来
    studentQuery.matchesKeyInQuery('nationality', 'name', countryQuery);
    studentQuery.find().then(function (students) {
        // students 包含 John Doe 和 Tom Sawyer
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

// 用户开课
function teach(userId, title, type) {
    console.log("开课")
    user = AV.Object.createWithoutData("Users", userId)
    var TestObject = AV.Object.extend('Lessons');
    var testObject = new TestObject();
    testObject.set('title', title);
    testObject.set('type', type);
    testObject.set('created_by', user)
    testObject.save().then(function (lesson) {
        console.log('保存成功');
    });
}

function learn(userId, lessonId) {
    console.log("开始学习")
    user = AV.Object.createWithoutData("Users", userId)
    lesson = AV.Object.createWithoutData("Lessons", lessonId)
    var TestObject = AV.Object.extend('Lesson_Members');
    var testObject = new TestObject();
    testObject.set('member', user);
    testObject.set('lesson', lesson);
    testObject.set('stats', 0)
    testObject.save().then(function (lesson) {
        console.log('保存成功');
    });
}

function award(userId, lessonId, stats) {
    console.log("加分")
    var query = new AV.Query('Lesson_Members')
    user = AV.Object.createWithoutData("Users", userId)
    lesson = AV.Object.createWithoutData("Lessons", lessonId)
    query.equalTo("member", user)
    query.equalTo("lesson", lesson)

    query.first().then(participation => {
        console.log("当前stats => " + participation.get("stats"))
        participation.increment("stats", stats)
        participation.save()
    })
}

function listMembers(lesson){
    lesson = new AV.Object.createWithoutData("Lessons", lesson)

    query = new AV.Query("Lesson_Members")
    query.equalTo("lesson", lesson)
    query.find().then(lesson_members => {
        members = lesson_members.map(lm => lm.get("member").id)
        //ids
        console.log(members)
    })

}
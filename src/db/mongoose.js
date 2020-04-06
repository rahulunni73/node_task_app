const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false,
    useNewUrlParser: true
});


// //~~~~~~~~~~~~~~~~~TASK~~~~~~~~~~~~~~~~~~~~


// let t = new Task({description:'task2'});
// t.save().then(()=>{
//      console.log(t)
//     }).catch((error)=>{
//     console.log(error)
// });

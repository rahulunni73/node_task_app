// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to the database");
    }
    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name:'Vikram',
    //     age:32
    // }, (error, result)=>{
    //     if(error){
    //         return console.log("Unable to insert user");
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     {
    //         name:'Jen',
    //         age:28
    //     },
    // {
    //     name:'Raju',
    //     age:34
    // }], (error,result)=>{
    //     if(error){
    //         return console.log("Unable to insert user");
    //    }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'task1',
    //         completed: false
    //     },
    //     {
    //         description: 'task2',
    //         completed: false
    //     },
    //     {
    //         description: 'task3',
    //         completed: true
    //     },
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert task");
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('users').findOne(
    //     {
    //         name:'Rahul'
    //     }
    //     , (error,result) =>{
    //     if(error){
    //         return console.log("Unable to find the user");
    //     }
    //     console.log(result);
    // });

    //use cursor to fetch data
    // db.collection('users').find({age: 32}).toArray((error,result) =>{
    //     if(error){
    //         return console.log("Unable to find the user");
    //     }
    //     console.log(result);
    // });

    // //use cursor to fetch data
    // db.collection('users').find({age: 32}).count((error,result) =>{
    //     if(error){
    //         return console.log("Unable to find the user");
    //     }
    //     console.log(result);
    // });


    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e7b6bfbeb615716eb5fac15"),
    // },
    //     {
    //         $set: {
    //             name:'unni'
    //         }
    //     }
    // ).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);            
    // });

    // db.collection('users').updateMany({
    //     age: 36,
    // },
    //     {
    //         $inc: {
    //             age : -2
    //         }
    //     }
    // ).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);            
    // });


    // db.collection('users').deleteOne(
    //     {
    //         _id: new ObjectID("5e7b6d96ce2a60181aa98910"),
    //     }
    //     ).then((result) => {
    //         console.log(result);
    //     }).catch((error) => {
    //         console.log(error);
    // });

    db.collection('users').deleteMany(
        {
            age: 30,
        }
        ).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
    });


});


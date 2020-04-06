require('../src/db/mongoose');
const Tasks = require('../src/models/task');

// Tasks.findByIdAndRemove('5e7c5388a6143c1b65408649')
// .then((result)=>{
//     console.log(result);
//     return Tasks.countDocuments({completed:false})
// })
// .then((count)=>{
//     console.log("Incompled Task Count ", count);
// })
// .catch((e)=>{
//     console.log(e);
// });

const removeTaskbyId = async (_id) =>{
    let task = await Tasks.findByIdAndRemove(_id);
    let count = await Tasks.countDocuments({completed:false});
    return count;
} 

removeTaskbyId('5e7cb6e962ed783fca05e13b')
.then((count) => {
    console.log("Number of taks incompleted ", count);
})
.catch((e) => {
    console.log(e);
})
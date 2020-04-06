require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5e7c566d05cd211d1761c896', {age:25} )
// .then((user)=>{
//         console.log(user);
//         return User.countDocuments({age:25});
// }).then((count)=>{
//     console.log(count);
// }).catch((e)=>{
//     console.log(e);
// })

const updateUserAgeById = async (_id, age) => {
    let user = await User.findByIdAndUpdate(_id, {age});
    let count = await User.countDocuments({age});
    return count;
}

updateUserAgeById('5e7c566d05cd211d1761c896', 38)
.then((count)=>{
    console.log("Number of count with given age is ",count);
})
.catch((e)=>{
    console.log(e);
})
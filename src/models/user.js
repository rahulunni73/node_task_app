const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./task');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a postive number");
            }
        }
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("The password should not contain 'password'! ");
            }
        }
    },
    tokens : [{
        token :{
            type:String,
            required:true
        }
    }],
    avatar: {
        type:Buffer
    },
},{
    timestamps:true
});


userSchema.virtual('tasks', {
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}


userSchema.methods.generateAuthToken = async function () {
    let user = this;
    let token = jwt.sign({ _id : user._id.toString()}, "rahul");
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject =    user.toObject();
    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar;
    return userObject;
}

//hash the plain text
userSchema.pre('save', async function (next) {
    let user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


//remove the user tasks when user is removed
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
   const user = this;
   try{
    await Tasks.deleteMany({ owner: user._id });
    next();
   }catch{
       throw new Error("Wel Done My boy");
   }
})


module.exports = mongoose.model('User', userSchema);

const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/authentication');
const sharp = require('sharp');

const router = express.Router();

const User = require('../models/user');
    
//SignUp
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    } catch (error) {
        res.status(400).send(error);
    }

});

//Login
router.post('/users/login',  async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send(error);
    }
});

//Read Profile 
router.get('/users/me',auth,async (req, res) => {
    try {
        //let users = await User.find({});
        let user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

//Logout User
router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send();
    }
})

//Logut All User Sessions
router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send();
    }
})


// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         let user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

router.patch('/users/me',auth, async (req, res) => {
    const requestedkeys = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = requestedkeys.every((requestedkey) => {
        return allowedUpdates.includes(requestedkey);
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: "invalid field update" });
    }

    try {

        //let user = await User.findById(req.user._id);
        let user = req.user;
        requestedkeys.forEach((requestedkey)=>{
            user[requestedkey] = req.body[requestedkey];
        })

        await user.save();
        //let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // if (!user) {
        //     return res.status(404).send();
        // }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error);
    }
});

//delete a user profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        //let deletedUser = await User.findByIdAndDelete(req.user._id); 
        //await req.user.remove();
        await req.user.deleteOne();
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error);
    }
})


const upload  = multer({
    //dest:'src/assets/avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb) {

        //!file.originalname.match(/\.(doc|docx)/)); only accepts word files
        //!file.originalname.endsWith('.pdf') only accepts .pdf files
        if( !file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error("File must be a JPEG | JPG | PNG"));
        }   
        cb(undefined,true);

        // cb(new Error("File must be a PDF")); file not accepted
        // cb(undefined,true); // file acepted and saved
        // cb(undefined,false); // file accepted but not saved
    }
});

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{  

    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.avatar =  buffer;
    await req.user.save();
    res.status(200).send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})


router.delete('/users/me/avatar',auth, async(req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send(req.user);
    }catch{
        res.status(400).send();
    } 

})


router.get('/users/:id/avatar',async(req,res)=>{
    try {
        let user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
        
    } catch (error) {
        res.status(404).send();
    }
})

module.exports = router ;
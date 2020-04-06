const express = require('express');
const router = express.Router();
const Tasks = require('../models/task');
const auth = require('../middlewares/authentication');

//create a post
router.post('/tasks',auth,async (req, res) => {
    //const task = new Tasks(req.body);
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);

    } catch (error) {
        res.status(400).send(error);
    }
});


// get all posts
//GET task?completed=true|false
//GET task?limit=number
//GET task?sortBy=createdAt:desc
router.get('/tasks',auth,async (req, res) => {
      const match = {}; 
      const sort =  {};
      if(req.query.completed){
          match.completed = req.query.completed === 'true'
      }
      if(req.query.sortBy){
          const queryParts = req.query.sortBy.split(':');
          sort[queryParts[0]] = queryParts[1] === 'desc' ? -1 : 1;
      }

    try {
        //let tasks = await Tasks.find({owner:req.user._id});
        let tasks = await req.user.populate({
            path:'tasks',
            options : {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            },
            match
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})





router.get('/tasks/:id',auth,async (req, res) => {
    const _id = req.params.id;

    try {
        //let task = await Tasks.findById(_id);
        const task = await Tasks.findOne( {_id, owner:req.user._id} ) // fetch task by id  with respect to the user id
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(e);
    }

})


router.patch('/tasks/:id',auth,async (req, res) => {
    const requestedkeys = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = requestedkeys.every((requestedkey) => {
        return allowedUpdates.includes(requestedkey);
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: "invalid field update" });
    }
    try {
        
        let updatedTask = await Tasks.findOne({_id:req.params.id, owner:req.user._id});

        //let updatedTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTask) {
            return res.status(404).send();
        }

        requestedkeys.forEach((requestedkey)=>{
            updatedTask[requestedkey] = req.body[requestedkey];
        })

        await updatedTask.save();

        res.status(200).send(updatedTask)
    } catch (error) {
        res.status(500).send(error);
    }
})


router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        //let deletedTask = await Tasks.findOneAndDelete(req.params.id);
        let deletedTask = await Tasks.findOneAndDelete({_id:req.params.id, owner:req.user._id});
        if (!deletedTask) {
            return res.status(404).send();
        }
        res.status(200).send(deletedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router ;
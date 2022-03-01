const express = require('express');
const Task = require('../models/task');
const router = express.Router();
const auth = require('../middleware/auth')
router.post('/tasks',auth,async(req,res)=>{
    try{
        //spread object 
        //tack a copy of object ...req.body
        //new Task({...req.body,req.user._id});
        const task = new Task({...req.body,owner:req.user._id});
        await task.save();
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }   
})
router.get('/tasks',auth,async(req,res)=>{
    try{
        // const tasks = await Task.find({});
        await req.user.populate('tasks');//virtual relation
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
///////////////////////////////////////////////////////////
//get task with out check user that is wrong version1
// router.get('/task/:id',auth,async(req,res)=>{
//     try{
//         const task = await Task.findById({_id:req.params.id});
//         if(!task){
//             return res.status(404).send('No tasks Found')
//         }
//         res.status(200).send(task)
//     }
//     catch(e){
//         res.status(500).send(e.message);
//     }
// })
//////////////////////////////////////////////////////////////
//versin 2 get task and check owner 
router.get('/task/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(!task){
            return res.status(404).send('No tasks Found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
/////////////////////////////////////////////////////////
//version 1 before owner
// router.patch('/task/:id',auth,async(req,res)=>{
//     try{
//         const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
//             new:true
//         })
//         if(!task){
//             return res.status(404).send('task not found');
//         }

//         res.status(200).send(task)
//     }
//     catch(e){
//         res.status(400).send(e.message);
//     }
// })
//////////////////////////////////////////////////////
//version 2 after owner
router.patch('/task/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndUpdate({_id:req.params.id,owner:req.user._id},req.body,{
            new:true
        })
        if(!task){
            return res.status(404).send('task not found');
        }

        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e.message);
    }
})
////////////////////////////////////
//version 1 delete task with out owner
// router.delete('/task/:id',auth,async(req,res)=>{
//     try{
//         const task = await Task.findByIdAndDelete(req.params.id);
//         if(!task){
//             return res.status(404).send('task not found')
//         }
//         res.status(200).send(task)
//     }
//     catch(e){
//         res.status(500).send(e.message);
//     }
// })
//////////////////////////////////////////
//version 2 delete task with owner
router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task){
            return res.status(404).send('task not found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e.message);
    }
})
////////////////////////////////////////////////////////
//get owner data from task 
router.get('/userTask/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send('no task')
        }
        await task.populate('owner')
        res.status(200).send(task.owner)
    }
    catch(e){
        res.status(500).send(e)
    }
})
module.exports = router;
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth')
const multer = require('multer')
//create instance to get CRUD Operation get & post / patch /delete
const router = new express.Router();

// router.post('/users',(req,res)=>{
//     const user = new User(req.body)
//     user.save().then(()=>{
//         res.status(200).send(user)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })
//sign up
router.post('/users',async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        const token =await user.genarateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredintals(req.body.email,req.body.password)
        const token = await user.genarateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.get('/users',auth,(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        //server error
        res.status(500).send(e)
    })
})
router.get('/profile',auth,async(req,res)=>{
    try{
        return res.status(200).send({user:req.user,token:req.token})
    }
    catch(e){
        res.status(500).send(e)
    }
})
router.get('/users/:id',auth,(req,res)=>{
    console.log(req.params)
    User.findById(req.params.id).then((user)=>{
        if(!user){
            //404 not found
            return res.status(404).send('user not found')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
//update patch
// instead of then and catch ==> async & await try& catch
router.patch('/users/:id',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!user){
            return res.status(404).send('no user found')
        }
        const updates = Object.keys(req.body);
        updates.forEach((el)=>{user[el] = req.body[el]})
        await user.save()
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.delete('/users/:id',auth,async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status
        }
    }
    catch(e){
        res.status(500).send(e)
    }
    
})
router.get('/porofile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((ele)=>{
            return ele !== req.token
        })
        await req.user.save()
        res.status(200).send('log out succefuly')
    }
    catch(e){
        res.status(500).send(e)
    }
})
//logout from all devices
router.delete('/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save();
        res.status(200).send('log out from all devices succefully')
    }
    catch(e){
        res.status(500).send(e)
    }
})
const uploads = multer({
    //limit of upload file 1MB
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('plz upload image'))
        }
        cb(null,true)
    }
})
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.user.avatar=req.file.buffer
        await req.user.save();
        res.status(200).send('image uploaded')
    }
    catch(e){
        res.status(500).send(e)
    }
})
module.exports = router
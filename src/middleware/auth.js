const jwt = require('jsonwebtoken');
const User = require('../models/user')
const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        // const decode = jwt.verify(token,'node_course');
        const decode = jwt.verify(token,process.env.jwt_security);
        console.log(decode)  //{ _id: '620e06ab49cdcc5f805470a1', iat: 1645086632 }
        const user = await User.findOne({_id:decode._id,tokens:token})
        if(!user){
            throw new Error('plz login')
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.status(401).send({error:'plz authenticate'})
    }
}
module.exports = auth;
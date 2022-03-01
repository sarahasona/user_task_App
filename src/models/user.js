//require mongoose
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }

        },
        age: {
            type: Number,
            default: 20,
            validate(value) {
                if (value <= 0) {
                    throw new Error('age is invalid')
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                let regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                if (!regEx.test(value)) {
                    throw new Error('password must include uppercase lowercase special characters')
                }
            }
        },
        avatar: {
            type: Buffer,
        },
        tokens: [
            {
                type: String,
                required: true
            }
        ]
    },
    {
        timestamps:{
            currentTime: ()=> new Date().getTime()+(2*60*60*1000)
        }
    }
)
userSchema.statics.findByCredintals = async (email, password) => {
    
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('unable to login check email and password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login check email and password')
    }
    return user
}
userSchema.methods.toJSON = function(){
    const user = this
    //convert document to object
    const userObj = user.toObject()
    delete userObj.password;
    delete userObj.tokens;
    return userObj
}
userSchema.methods.genarateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.jwt_security)
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}
userSchema.virtual('tasks', {
    ref: 'Task',
    //local field in user 
    localField: '_id',
    //foregin field in task
    foreignField: 'owner'
})
userSchema.pre('save', async function () {
    const user = this
    //user.isModified('password')  that means if user send password
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }


})
const User = mongoose.model('User', userSchema)
module.exports = User;
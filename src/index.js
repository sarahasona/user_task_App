//npm init -y
//npm i express
require('dotenv').config()
const express = require('express');
const app = express();

// const port = process.env.PORT || 3000;
const port = process.env.PORT;
//to link front end with back end use cors module
const cors = require('cors')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')
//convert from json to object
app.use(express.json())
//app.use(cors()) before any router
app.use(cors())
app.use(userRouter)
app.use(taskRouter)
app.listen(port,()=>{
    console.log(`Server is running at port ${port}` )
})
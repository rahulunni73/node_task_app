const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user-router');
const taskRouter = require('./routers/task-router');

const app = express();
const port = process.env.PORT || 3000;


//Middileware run before router handler
// app.use((req,res,next) => {
//     res.status(503).send("Service is temporary down!");
//     //next() // should call next to execute router handlers
// })


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log("The express server is up and run on port " + port);
})


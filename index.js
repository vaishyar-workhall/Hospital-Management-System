const express=require('express');
const config=require('config');
const app=express();
require('./startup/routes')(app);
const {connectToMongoDB}=require('./startup/db');
connectToMongoDB();

if(!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

process.on('uncaughtException', (ex) => {
    console.error('WE GOT AN UNCAUGHT EXCEPTION');
    console.error('Error message:', ex);
    process.exit(1);
});

const port=process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listening to port ${port}..`));
const {MongoClient}=require('mongodb');
const url='mongodb://localhost:27017';
const dbName='HMS';
const client=new MongoClient(url);

let db;
const connectToMongoDB=async ()=>{
    try{
        await client.connect();
        console.log('Connected to MongoDB');
        db=client.db(dbName);
        return db;
    }
    catch(err){
        console.log(err.message);
    }
}
const getConnection=async()=>{
    if(db)
    {
        return db;
    }
    else{
        await connectToMongoDB();
    }
}

module.exports={connectToMongoDB,getConnection};
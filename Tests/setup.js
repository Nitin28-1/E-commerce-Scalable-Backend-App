const mongoose=require('mongoose');
const {MongoMemoryReplSet }=require('mongodb-memory-server');

require("dotenv").config({
  path: ".env.test"
});

let replset;

//Test run hone se phle run hota hai
beforeAll(async ()=>{

     replset =await MongoMemoryReplSet.create({
        replSet:{count:1}
     });
     const uri=replset.getUri();
     await mongoose.connect(uri);

})

//Hr ek test run hone ke baad run hota hai yeah 
afterEach(async()=>{
    const collections=await mongoose.connection.db.collections();
    for(let collection of collections)
    {
        await collection.deleteMany({});
    }
});

// yeah function sbhi test case ke run hone ke baad run hota hai 
afterAll(async()=>{
    await mongoose.connection.close();
    await replset.stop();
})
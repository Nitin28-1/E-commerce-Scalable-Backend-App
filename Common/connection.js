const mongoose=require('mongoose');

const connectDB=async ()=>
{
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Mongo DB Connected Successfully...");

    } catch (error) {
     console.log("Failed To Connect MongoDB",error);
     process.exit(1)
    }
}

module.exports ={ connectDB};
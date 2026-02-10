require('dotenv').config();
const common=require('./Common/index')
const app=require('./app')

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Our Server is Running on Port Number: ${PORT}`); 
    if(process.env.NODE_ENV !== "test")
    {common.connection.connectDB();}
})


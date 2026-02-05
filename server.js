const express= require('express');
const cors= require('cors');
require('dotenv').config();
const apiRoutes=require('./Routes/api')
const common=require('./Common/index')

const app=express();
app.use(cors());


app.use(express.json());
const PORT=process.env.PORT || 5000

app.use('/api/v1',apiRoutes);


app.listen(PORT,()=>{
    console.log(`Our Server is Running on Port Number: ${PORT}`);  
    common.connection.connectDB();
})


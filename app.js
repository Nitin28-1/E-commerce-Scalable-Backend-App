const express=require('express');
const cors=require('cors');
const apiRoutes=require('./Routes/api');

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/v1',apiRoutes);

module.exports=app;
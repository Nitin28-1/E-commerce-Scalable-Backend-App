const express=require('express');
const auth=require('./Auth');
const product=require('./Product');
const category=require('./Category');
const cart=require('./Cart');
const wishlist=require('./Wishlist');
const review=require('./Review');
const order=require('./Order')
const admin=require('./Admin')
const app=express();

app.use('/auth',auth);
app.use('/product',product);
app.use('/category',category);
app.use('/cart',cart);
app.use('/wishlist',wishlist);
app.use('/review',review);
app.use('/order',order);
app.use('/admin',admin);

module.exports=app;
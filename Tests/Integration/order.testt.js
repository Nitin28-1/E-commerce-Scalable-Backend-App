jest.mock('razorpay');

const request=require('supertest');
const app=require('../../app');
const model=require('../../Models/index')

let token;

describe("Order Testing ", ()=>{

  test("could place order is success",async ()=>
 {
         const result=  await request(app).post('/api/v1/product/add')
        .send({
        title:"Iphone 16 Pro",
        price:258000,
        description:"A Expensive  .",
        categoryId:"69622f403378191687d8dd79",
        quantity:250,
        image:"http://asdfihskdfska.png"

        });

                console.log(result.body.data);

        const placeOrder=await request(app).post('/api/v1/order/place')
        .send({
            items: [
         {
            _id: result.body.data._id
            ,
             quantity: 10
         }
       ]
        })

       
         expect(placeOrder.body.status).toBe(1);
         expect(placeOrder.body.data.order[0].paymentStatus).toBe('PENDING');
   
   
     })
  

  test("could get my order success",async ()=>
 {
         const result=  await request(app).post('/api/v1/product/add')
        .send({
        title:"Iphone 16 Pro",
        price:258000,
        description:"A Expensive  .",
        categoryId:"69622f403378191687d8dd79",
        quantity:250,
        image:"http://asdfihskdfska.png"

        });

        console.log(result.body.data);

        const placeOrder=await request(app).post('/api/v1/order/place')
        .send({
            items: [
         {
            _id: result.body.data._id
            ,
             quantity: 10
         }
       ]
        })

       
         const getMyOrder=await request(app).get('/api/v1/order/get');

         console.log('Getting my order',getMyOrder);
   
   
     })
  
  
})
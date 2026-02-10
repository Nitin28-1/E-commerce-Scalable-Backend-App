jest.mock('../../Services/mailService');

const request=require('supertest');
const app=require('../../app');
const model=require('../../Models/index')
// const {sendRegisterEmail}=require('../../Services/mailService')

let token;
//isko bina 
describe("Product Section testing", ()=>{


   //User register 
   beforeEach(async ()=>
   {
      const register=await request(app)
      .post('/api/v1/auth/register')
      .send({
    name:"test",
    email:"test@gmail.com",
    password:"test@123",
    confirmPassword: "test@123",
    role:"Seller" })

    const user=await model.User.findOne({email:"test@gmail.com"});

    //Verify Register User
    await request(app)
    .post(`/api/v1/auth/verify-email/${user.confirmationToken}`)


   //Login register User 

      const loginres=await request(app)
      .post('/api/v1/auth/login')
      .send({
         email:"test@gmail.com",
         password:"test@123"
      });

      console.log("Login res",loginres.body)
     token=loginres.body.data.token

   })

    test("/getAll /api/v1/products/getAll Getting All Product Data",async ()=>{
     

        await request(app).post('/api/v1/product/add')
        .set("Authorization", `Bearer ${token}`)
        .send({
        title:"Xiaomi Note 18",
        price:258,
        description:"A Expensive  .",
        categoryId:"69622f403378191687d8dd79",
        quantity:250,
        image:"http://asdfihskdfska.png"

        })
        
        const result=await request(app).get('/api/v1/product/getAll')
           .set("Authorization", `Bearer ${token}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.data[0].title).toBe("Xiaomi Note 18")
        expect(result.body.data[0].quantity).toBe(250)
    
     })

     test("getSingle Prodcut Data",async ()=>
   {   
         const result=  await request(app).post('/api/v1/product/add')
        .set("Authorization", `Bearer ${token}`)
        .send({
        title:"Iphone 16 Pro",
        price:258000,
        description:"A Expensive  .",
        categoryId:"69622f403378191687d8dd79",
        quantity:250,
        image:"http://asdfihskdfska.png"

        })
 
        console.log("result datt",result.body)

        const demo=await request(app).get(`/api/v1/product/get/${result.body.data._id}`)
           .set("Authorization", `Bearer ${token}`);
        expect(demo.statusCode).toBe(200);
        expect(demo.body.data.title).toBe("Iphone 16 Pro")
        expect(demo.body.data.price).toBe(258000)
      

   })

})
const model=require('../Models/index');
const apiResponse=require('../Helpers/apiResponse')

module.exports.addProduct=async (req,res)=>
{
    try {

        const {title,price,description,categoryId,quantity,image}=req.body;
        
        const product=await model.Product.create({
            title:title,
            price:price,
            description:description,
            categoryId:categoryId,
            quantity:quantity,
            sellerId:req.user._id,
            image:image
        });


        return apiResponse.successResponseWithData(res,"Product Successfully Added.",product);

    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res,"Failed To Add Product.")
    }
}

module.exports.getAllProducts=async (req,res)=>
{
    try { 
        console.log('Get all product call ho rha hai');
        const{search,minPrice,maxPrice,categoryId,sort}=req.query;

        const filters={};

        filters.isActive=true;

        if(search)
        {
            filters.title={$regex:search,$options:"i"};
        }

        if(categoryId)
        {
            filters.categoryId=categoryId
        }
        

        if(minPrice || maxPrice)
        {
            filters.price={};

            if(minPrice) filters.price.$gte=Number(minPrice);
            if(maxPrice) filters.price.$lte=Number(maxPrice);
        }

        const sortOptions={}

        if(sort === 'price_asc') sortOptions.price=1;
        if(sort === 'price_desc') sortOptions.price=-1;

        const products=await model.Product.find(filters).sort(sortOptions)

        return apiResponse.successResponseWithData(res,"Successfully Fetched Product List.",
            products
        )

    } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res,"Failed To Get All Products.")
    }
}
module.exports.getSingleProduct=async (req,res)=>
{
    try {
        console.log("singlep product calling")
     
        const {productId}=req.params
           console.log(productId)
        const product=await model.Product.findOne({
            _id:productId,
            isActive:true
        });

        if(!product)
        {
            return apiResponse.unauthorizedResponse(res,"Product Not Exist");
        }

        return apiResponse.successResponseWithData(res,"Product Data Fetched Success",
            product
        )

    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(res,"Failed To Fetch Product.")
    }
}

module.exports.updateProduct=async (req,res)=>
{
    try {
     const {productId}=req.params;

     const product=await model.Product.findOneAndUpdate({
        _id:productId,
        sellerId:req.user._id
     },
     {
        $set:req.body
     },
     {
        new:true,
        runValidators:true
     }
    );

     if(!product)
     {
        return apiResponse.unauthorizedResponse(res,'There is no Product Exist With this ID.');
     }

     return apiResponse.successResponseWithData(res,"Product Details Updated Successfully.",product);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Update Products Details ")
    }
}

module.exports.deleteProduct=async (req,res)=>
{
    try {
        
        const {productId}=req.params;

        const productDeleted=await model.Product.findOneAndDelete({
            _id:productId,
            sellerId:req.user._id
        });

        if(!productDeleted)
        {
            return apiResponse.unauthorizedResponse(res,"Failed To Delete Product.");
        }

        return apiResponse.successResponseWithData(res,"Product Deleted Successfully.",productDeleted);

    } catch (error) {
        return apiResponse.ErrorResponse(res,"Failed To Delete The Product.")
    }
}
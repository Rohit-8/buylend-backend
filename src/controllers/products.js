const express = require('express');
const app=express();
const { pool } = require("../../pool_connection");
const Pool = require("pg").Pool;
const Users = require("../models/users");
const Approval = require("../models/approvals");
const Products = require("../models/products");
const UserOrgs = require("../models/user_orgs");
const Organisations = require("../models/organisations");
const ProductModeDetails = require("../models/product_mode_details");

app.use(express.json());// we access any data sent by the client side via req.body;


//Inserting a new product
app.post('/org/newproduct',async(req,res)=>{
  const {
    id,
    product_name,
    category,
    product_image,
    description,
    user_id,
    org_id,
    available
  }=req.body;

  try{
    const insertNewProduct=await pool.query(`INSERT INTO buylend_schema.products(id,product_name,category,product_image,description,user_id,org_id,available) VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8) returning*`,[id,product_name,category,product_image,description,user_id,org_id,available]);
    res.status(200).json(insertNewProduct.rows);
  }
  catch(error)
  {
    console.log(error.message);
    res.status(500).json(error);
  }
});



//Getting Organisation Specific Products
app.get('/org/:orgId',async(req,res)=>{
  const {orgId}=req.params;
  try{
    const getProductsByOrgId=await pool.query(`SELECT * from buylend_schema.products where org_id=$1`,[orgId]);
    res.status(200).json(getProductsByOrgId.rows);
  }
  catch(error){
    console.log(error.message);
    res.status(500).json(error);
  }
});


//Update existing product
app.put('/org/updateproduct/:id',async(req,res)=>{
  const{
    id
  }=req.params;

  const {
    description,
    available
  }=req.body;

  try{
    const updateExistingProduct=await pool.query(`UPDATE buylend_schema.products SET description=$1,available=$2 WHERE id=$3`,[description,available,id]);
    res.status(200).json(updateExistingProduct.rows);
  }
  catch(error)
  {
    res.status(500).json(error);
  }

});

//Delete a product
app.delete('/org/deleteproduct/:id',async(req,res)=>{
  const {id}=req.params;
  try{
    const deleteProduct=await pool.query(`DELETE FROM buylend_schema.products WHERE id=$1`,[id]);
    res.status(200).json(deleteProduct.rows);
  }
  catch(error){
    res.status(500).json(error);
  }
});

//Getting All details of a specific product
app.get('/org/product/:proId',async(req,res)=>{
  const {proId}=req.params;
  try{
    const getAllInfo=await pool.query(`SELECT product_name,category,product_image,description,available,price,name,email
    ,phone_number FROM buylend_schema.products AS P INNER JOIN buylend_schema.product_mode_details AS Q
    ON P.id=Q.product_id INNER JOIN buylend_schema.users AS R ON P.user_id=R.id WHERE P.id=$1`,[proId]);
    res.status(200).json(getAllInfo.rows);
  }
  catch(error)
  {
    res.status(500).json(error);
  }
})

//Search Products by Category
app.get('/org/:orgId/category/:category',async(req,res)=>{
  const {
    orgId,
    category
    }=req.params;
  try{
    const getProductsByCategory=await pool.query(`SELECT * FROM buylend_schema.products WHERE category=$1 AND
    org_id=$2`,[category,orgId]);
    res.status(200).json(getProductsByCategory.rows);
  }
  catch(error)
  {
    res.status(500).json(error);
  }

});

//Get products of an organisation according to availabilty
app.get('/org/:orgId/mode/:available',async(req,res)=>{
  const {
    orgId,
    available
    }=req.params;
  try{
    const getProductsByAvailability=await pool.query(`SELECT * FROM buylend_schema.products WHERE available=$1 
    AND org_id=$2`,[available,orgId]);
    res.status(200).json(getProductsByAvailability.rows);
    console.log(getProductsByAvailability);
  }
  catch(error)
  {
    res.status(500).json(error);
  }

});

//Search Products by Location
app.get('/org/location/:location',async(req,res)=>{
  const{location}=req.params;
  console.log(location);
  try{
    const getProductsByLocation=await pool.query(`SELECT product_name,category,product_image,description,available,org_location 
    FROM buylend_schema.products AS P INNER JOIN buylend_schema.organisations
    AS O ON P.org_id=O.id 
    WHERE org_location=$1`,[location]);
    res.status(200).json(getProductsByLocation.rows);
  }
  catch(error){
    res.status(500).json(error);
  }
});


module.exports=app;
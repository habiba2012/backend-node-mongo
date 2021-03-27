const express = require('express');
const cors = require('cors');
const password ='test123';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://organicuser:test123@cluster0.f4ndo.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });


client.connect(err => {
    console.log('connected');
  const productCollection = client.db("organicdb").collection("products");
  
  app.post('/addProduct',(req,res)=>{
    const product = req.body;
     console.log(product)
    productCollection.insertOne(product)
    .then(result=>{
        console.log(result,"insert new product")
        res.redirect('/')
    })
  })
  app.patch('/update/:id',(req,res)=>{
      console.log(req.body)
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
          $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result =>{
          res.send(result.modifiedCount > 0)
      })
  })
  app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id)
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((err,result)=>{
        res.send(result.deletedCount>0);
    })
    })
    //update products
    app.get('/product/:id',(req,res)=>{
        // console.log(product, id)
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0])
            console.log('updated')
        })
    })
    
    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
            console.log(err)
    
        })
    })
//   client.close();
})
//delete products


app.listen(4200,()=>
    console.log('App listen to port 4200'))

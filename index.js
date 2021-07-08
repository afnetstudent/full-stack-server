const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb');
const app = express()
const port = process.env.PORT || 8080

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jayfm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const productcollection = client.db("sajow").collection("production");
  // const orderCollection = client.db("sajow").collection("Allorders");

  


  app.get('/products', (req, res) => {

    productcollection.find()
    .toArray((err , items) => {
      res.send(items)
     
    })
  })

 

  app.get('/singleproduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log('my id from database', id)
    productcollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, document) => {
      res.send(document[0])
    })
  })

  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('addeing product', newProduct)
    
    productcollection.insertOne(newProduct)
    .then(result => {
      console.log('insert count', result.insertedCount)
      res.send(result.insertedCount >0)
    })

    app.post('/myorder', (req, res) => {
      console.log(req)
    })
    
  //   app.post('/orders', (req, res) =>{
  //     const newOrder = req.body;
  //     console.log('order-added', newOrder)
      
  //     })
    
  })

  
  // client.close();

});






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const express = require("express");
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload')


app.use(cors());
app.use(express.json());
app.use(fileUpload())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6666.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('hitting database')
      const registered = client.db('allFoodie');
      const allUsers = registered.collection('all_foddies_list');
      const droneData = client.db('allDroneData');
      const addDroneData = droneData.collection('addDroneDataList');
      const placeOrder = client.db('placeORder');
      const allPlaceORder = placeOrder.collection('placeOrderList');
      

      app.post("/addDrone", async (req, res) => {

        const user = req.body;
        console.log(user)
        const droneName = user.droneName;
        const droneDes = user.droneDes;
        const dronePrice = user.dronePrice;
        const picture = user.droneImg;
        // const picData = picture.data;
        // const encodedData =  picData.toString('base64');
        // const picBuffer = Buffer.from(encodedData,'base64');
        const product = {
            droneName:droneName,
            droneDes:droneDes,
            dronePrice:dronePrice,
            droneImg:picture 
          }
        const result = await addDroneData.insertOne(product);
        res.json(result);
       
    });        
    app.get('/getDrone',async (req,res)=>{
      const cursor = addDroneData.find({});
      const drone = await cursor.toArray();
      res.send(drone);      
    })
    app.get('/placeorder/:id', async (req, res) =>  {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const place = await addDroneData.findOne(query);
      res.json(place);

   })
   app.post("/placeorder", async (req, res) => {
    const user = req.body;
    const result = await allPlaceORder.insertOne(user);
    res.json(result);
});    
 
  app.get('/myorders/:email', async (req, res) => {
    const email = req.params.email;
    const result = await allPlaceORder.find({ email: email }).toArray();
    res.send(result);
    
});
  app.get('/allorder/', async (req, res) => {
    const email = req.params.email;
    const result = await allPlaceORder.find({}).toArray();
    res.send(result);
    
});
app.get('/image/:id',async (req,res)=>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)}
  const result = await addDroneData.find(quert).toArray();
  res.send(result); 
  console.log(id)     
})
app.delete("/removeorder/:id", async (req, res) => {
  const id = req.params.id ;
  const query = {_id: ObjectId(id)}
  const result = await allPlaceORder.deleteOne(query);
  console.log(result);
  res.json(result);
});

  
  
    }
    finally {
      // await client.close();
  
    }
  
  }
  run().catch(console.dir);
  
  
app.get('/',(req,res)=>{
    res.send('running food server')
})
app.listen(port,()=>{
    console.log('running server')
})
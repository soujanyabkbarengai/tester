const express = require("express");
const app = express();
const filename = "/public/index.html";
const PORT = 8080;
const bodyParser = require("body-parser");
const router=express.Router();
const MongoClient=require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const url=require('./secret.js');


//middleware funcitons...
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.json());
app.use(bodyParser.json());

MongoClient.connect(url,(err,db)=>{
    if(err)
    throw err
    console.log("connected to Mongodb server");
    db.close();
})

const client=new MongoClient(url,{

   useNewUrlParser:true,
   useUnifiedTopology:true

})


client.connect(err=>{

const myDb=client.db('people').collection('friends');

app.get('/user/:name',(req,res)=>{
    
    console.log(req.params);
    myDb.find(req.params).toArray().then(results=>{
        console.log(results);
        res.send(JSON.stringify(results));
     })
})

app.route('/users')
.get((req,res)=>{
     myDb.find().toArray().then(results=>{
        console.log(results);
        res.send(JSON.stringify(results));
     })
})
.post((req,res)=>{
    console.log(req.body);
    myDb.insertOne(req.body).then(results=>{
      //  console.log(results);
        res.contentType('application/json');
        res.send(JSON.stringify(req.body));
    })
})
.put((req,res)=>{
    console.log(req.body);
    myDb.findOneAndUpdate({
       _id:ObjectId(req.body._id)
    },{
$set:{name:req.body.name
     }
    },{upsert:false}).then(results=>{
        console.log(results);
        res.send(JSON.stringify(results));
     })

})
.delete((req,res)=>{
    console.log(req.body);
    myDb.deleteOne({

        _id : ObjectId(req.body._id)
    }).then(results=>{
        //  console.log(results);
        let boo=true;
        if(results.deletedCount==0)
        {
            boo:false
        }
          res.send({"status":boo})
        }).catch(error=>console.log(error))

})
   
})


app.get("/", (req, res) => {
    res.sendFile(__dirname + filename);
  });
  

  app.listen(PORT, function(error){
    if (error) throw error
    console.log("Server running successfully on PORT : ", PORT)
  })

  module.exports = app;
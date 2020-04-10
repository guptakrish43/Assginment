var express=require("express"); 
var bodyParser=require("body-parser"); 
var requestIp = require('request-ip');
var dtFormat = require('dateformat');

  
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/user'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express() 
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.use(bodyParser.json()); 
app.use(requestIp.mw());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 


function InsertData(data){
    db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
    });
 
}  


app.post('/sign_up', function(req,res){ 
    var name = req.body.name; 
    var email =req.body.email; 
    var pass = req.body.pass; 
    var clientIp = req.clientIp;
    var dat = new Date();
    dat=dtFormat(dat, "dd,mm,yyyy");
    console.log(dat);
    var data = { 
        "name": name, 
        "email":email, 
        "password":pass,
        "ip":clientIp,
        "date":dat,
    } 
    db.collection('details').count({ip : clientIp, date : dat}, function(err, cnt){
        console.log(cnt);
        if(cnt > 3){
            res.render('cap',{
                "data" : data
            });
        }else{          
            InsertData(data); 
            res.render('success'); 
        }
    });
   
}) 


  
  
app.get('/',function(req,res){ 
    res.render('index'); 
}).listen(3001) 
  
  
console.log("server listening at port 3001"); 
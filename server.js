const express = require('express');
const app = express();
var cors = require('cors')
const PORT = process.env.PORT || 3000;
const FCM = require('fcm-node')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var serverKey = require('./privateKey.json') //put the generated private key path here    

const Notification = require('./models/Notification')

const mongoose = require('mongoose');

MONGODB_URL= 'mongodb+srv://learnnodejs:learnnodejslearnnodejslearnnodejs@cluster0.wdwpr.mongodb.net/notification_flutter?retryWrites=true&w=majority';
mongoose.connect(
    MONGODB_URL, 
    { useNewUrlParser: true }
  )
  .then((result) => console.log("Connection"))
  .catch((error) => console.log('Error'));


var fcm = new FCM(serverKey);
app.use(cors());
app.post("/", function(req, res){
    console.log(req.body)
    res.send("Post")
})

app.post('/login', (req, res)=>{
    console.log("123456");
    console.log(req.body);
});

app.post("/notifications" , async (req,res) => {

    try{
        var message = { 
            to: req.body.token,
            // collapse_key: '...',
        
            notification: {
                title: req.body.title,
                body: req.body.body
            },
        
            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        }
        
        fcm.send(message, function (err, response) {
            if (err) {
                res.status(500).json({success: false});
                console.log("Something has gone wrong!")
            } else {
                res.status(200).json({success: true});

                console.log("Successfully sent with response: ", response)
                const add_notification = new Notification({ 
                    token: req.body.token,
                    title: req.body.title,
                    content:  req.body.body
                })
            
                const saveNotification = add_notification.save();
                res.status(200).json({success: true});
            }
        })
        
    
        
    } catch (e){
        res.status(500).json({success: false});
    }

})

app.get("/notifications" , async (req,res) => {
    console.log("Get")
    try{
        const notifications = await Notification.find();
        return res.status(200).json(notifications);
    } catch (e){
        res.status(500).json(e);
    }

})

app.get("/notifications/:token" , async (req,res) => {

    try{
        const token = req.params.token;
        const notifications = await Notification.find({token: token});
        return res.status(200).json(notifications);
    } catch (e){
        res.status(500).json(e);
    }

})

app.listen(PORT, () => console.log(`server started ${PORT}`))
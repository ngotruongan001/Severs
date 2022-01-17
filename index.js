const express = require('express');
const app = express();
var cors = require('cors')
const PORT = process.env.PORT || 3000;
const FCM = require('fcm-node')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var serverKey = require('./privatekey.json') //put the generated private key path here    

var fcm = new FCM(serverKey);
app.use(cors());
app.post("/", function(req, res){
    console.log(req.body)
    res.send("Post")
})



app.post("/notifications" ,(req,res) => {

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
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
    res.send("Send Notifications successfully!!")
})

app.listen(PORT, () => console.log(`server started ${PORT}`))

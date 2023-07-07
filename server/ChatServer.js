const express = require('express');
const WebSocket = require('ws');
const uri = "mongodb+srv://admin:Adminpassword56@atlascluster.jsf9bmd.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const app = express();
const server = require('http').createServer(app);

const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on("connection",  function(ws,req) {
    //console.log(req.url);
    if(req.url==="/getConversationHeaders"){
        ws.on('message', async (message) => {
            message= JSON.parse(message);
            //console.log('Received message:', message.user);
            let user = message.user;
            // Process the received message here
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("chats").command({ ping: 1 });
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const chats= client.db("chats");
            let results= await chats.collection("conversations").find({username:user}).toArray();
            let currentConvos = results.map(item => item.touser);
            
            ws.send(JSON.stringify(currentConvos));
        });
        
    }
    if(req.url=="/sendMessage"){
        ws.on('message', async (message) => {
            message= JSON.parse(message);
            console.log(message)
            let userMsg = message.currentMsg
            let date= message.date
            let user = message.userfrom
            let user2 = message.userto
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("chats").command({ ping: 1 });
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const chats= client.db("chats");
            let results = await chats.collection("conversations").findOne({username:user, touser:user2});
            console.log("results",results.conversation)
            results.conversation.push([userMsg,date, user]);
            chats.collection("conversations").updateOne( {username:user, touser:user2}, { $set: { conversation: results.conversation } } ) 
            
        })
    }
    if(req.url=="/getHistory"){
        ws.on('message', async (message) => {
            message= JSON.parse(message);
            //console.log(message);
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("chats").command({ ping: 1 });
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const chats= client.db("chats");
            let results= await chats.collection("conversations").find({username:message.userfrom, touser:message.userto}).toArray();
            let results2= await chats.collection("conversations").find({username:message.userto, touser:message.userfrom}).toArray();
            let flattenedArray = [...results, ...results2]
              .flatMap(item => item.conversation)
              .sort((a, b) => new Date(a[1]) - new Date(b[1]));
      
            console.log(flattenedArray);
            ws.send(JSON.stringify(flattenedArray));
        })
    }
});


server.on('upgrade', function(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function(ws) {
        wsServer.emit('connection', ws, request);
    });
});

const port = 8080;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
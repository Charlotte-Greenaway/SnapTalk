const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require("bcrypt")//for encryption
const saltRounds = 10;
const uri = "mongodb+srv://admin:Adminpassword56@atlascluster.jsf9bmd.mongodb.net/?retryWrites=true&w=majority"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongo db
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//sign in and login functs
async function login(username,password) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("adminDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const loginDb= client.db("adminDB");
      try {
        const result = await loginDb.collection("users").findOne({username:username});
        if(result!=null){
          console.log("username found");
          const match = await bcrypt.compare(password, result.password);
          console.log((match)?"correct pass":"incorrectpass");
          return((match)?true:"Incorrect Password")
        };
        if(result==null){
            return("Incorrect username and password");
        };
      } catch (err) {
        console.log(err);
      } finally {
        if (client) {
            client.close(); // Close the MongoDB connection
          } // Close the MongoDB connection
      }
  }catch(error){
    console.log(error);
  }
}
async function signin(username,password,email) {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("adminDB").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const loginDb= client.db("adminDB");
        try {
          const result = await loginDb.collection("users").findOne({username:username});
          const emailcheck = await loginDb.collection("users").findOne({email:email});
          if(result!=null ||emailcheck!=null){
            console.log("username or email found");
            return((result==null)?"Emailaddress already in use":"Unavailable username")
          };
          if(result==null){
            try{
                var userObj = { username: username, password: password, email:email };
                await loginDb.collection("users").insertOne(userObj)
                const friendsDB= client.db("FriendsDB");
                await friendsDB.collection("friends").insertOne({
                  username: username,
                  friends:[""]
                })
                return(true);
            }catch(error){
                return("Unable to set up account");
            }
          };
        } catch (err) {
          console.log(err);
          return("Unable to set up account");
        } finally {
          client.close(); // Close the MongoDB connection
        }
    }catch(error){
      console.log(error);
    }
  }

  //friends functs
  async function getUserFriends(user){
    try{
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("FriendsDB").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const friendsDB= client.db("FriendsDB");
      const result = await friendsDB.collection("friends").findOne({username:user});
      return (result.friends)
    }catch(error){
      console.log(error);
    }
  }
  async function getRequests(touser){
    try{
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("FriendsDB").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const friendsDB= client.db("FriendsDB");
      var userRequests = await friendsDB.collection("requests").find({tousername:touser}).toArray();
      userRequests =userRequests.map(item => item.requsername);
      var currentFriends= await friendsDB.collection("friends").findOne({username:touser});
      currentFriends=currentFriends.friends;
      console.log(currentFriends, userRequests);
      const filteredUserRequests = userRequests.filter(element => !currentFriends.includes(element));
      console.log(filteredUserRequests)
      return (filteredUserRequests)
    }catch(error){
      console.log(error);
    }
  }
  async function findUsers(user,currentUser){
    try{
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("adminDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const adminDB= client.db("adminDB");
    const result = await adminDB.collection("users").find(
      { username: { $regex: user, $options: "i" } },
      { projection: { _id: 0, username: 1 } }
    ).toArray();
    const usernames = result.map(obj => obj.username);
    const filteredResult = usernames.filter(item => item !== currentUser);
    return (filteredResult)
    }catch(error){
      console.log(error);
    }
  }
  async function requestFriend(touser,requser){
    try{
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("FriendsDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const friendDB= client.db("FriendsDB");
    const checkCurrentUser = await friendDB.collection("requests").findOne({requsername:requser,tousername:touser});
    const checkOtherUser= await friendDB.collection("requests").findOne({requsername: touser, tousername:requser});
    //console.log(checkCurrentUser,checkOtherUser )
    if (checkCurrentUser !=null && checkOtherUser !=null){
      console.log("friends"); 
    }else if(checkCurrentUser !=null && checkOtherUser ==null){
      //current user has already made a request
    }else if(checkCurrentUser ==null && checkOtherUser !=null){
      let addFriend1 = await friendDB.collection("friends").findOne({username: requser});
      let addFriend2 = await friendDB.collection("friends").findOne({username: touser});
      addFriend1.friends.push(touser);
      addFriend2.friends.push(requser);
      console.log(addFriend1,addFriend2)
      friendDB.collection("requests").insertOne({
        requsername: requser,
        tousername: touser
      })
      await friendDB.collection("friends").updateOne({ username: requser }, { $set: {friends:addFriend1.friends} });
      await friendDB.collection("friends").updateOne({ username: touser }, { $set: {friends:addFriend2.friends} });
    }else if(checkCurrentUser ==null && checkOtherUser ==null){{ $set: { likes: 2 } }
      //make the current users request
      friendDB.collection("requests").insertOne({
        requsername: requser,
        tousername: touser
      })
    }
    //return (usernames)
    }catch(error){
      console.log(error);
    }
             
  }

async function addConversation(user,user2){
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("chats").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  const chatsDB= client.db("chats");
  let result= await chatsDB.collection("conversations").findOne({username: user,touser: user2});
  console.log(result)
  if(result==null && user2 !== null && user2 !== ""){
    await chatsDB.collection("conversations").insertOne({
      username: user,
      touser: user2,
      conversation:[]
    })
    await chatsDB.collection("conversations").insertOne({
      username: user2,
      touser: user,
      conversation:[]
    })
}
}

async function getHistory(user, user2){
      // Process the received message here
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("chats").command({ ping: 1 });
      //console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const chats= client.db("chats");
      let results= await chats.collection("conversations").find({username:user, touser:user2}).toArray();
      let results2= await chats.collection("conversations").find({username:user2, touser:user}).toArray();
      let flattenedArray = [...results, ...results2]
        .flatMap(item => item.conversation)
        .sort((a, b) => new Date(a[1]) - new Date(b[1]));

      console.log(flattenedArray);
      return(flattenedArray);
}


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });



//handle requests
app.post("/submit-signin", async function(req, res) {
    const attributes = {};
  
    for (const [key, value] of req.body) {
      attributes[key] = value;
    }
  
    const username = attributes.username;
    const email = attributes.email;
    const password = attributes.password;
    let result; // Declare the variable outside the promise chain
  
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      console.log('Salt:', salt);
      const hash = await bcrypt.hash(password, salt);
      console.log('Hash:', hash);
      result = await signin(username, hash, email);
    } catch (err) {
      console.error(err.message);
      res.send({ message: 'An error occurred' });
      return;
    }
  
    res.send({ message: result });
  });
  


  app.post("/submit-login", async function(req, res) {
    const attributes = {};

    for (const [key, value] of req.body) {
        attributes[key] = value;
    }

    const username = attributes.username;
    const password = attributes.password;
    
    const result= await login(username,password)
    console.log(username,password);
    res.send({message: result});
  
    // Send a response
    //res.send("Form data received successfully");
  });

  app.post("/getFriends", async function(req,res){
    console.log(req.body.username);
    let user= req.body.username;
    let friends= await getUserFriends(user);
    let requestedUsers= await getRequests(user);
    res.send({friends, requests: requestedUsers});
  })
  app.post("/getUsers", async function(req,res){
    console.log(req.body.username);
    let user= req.body.username;
    let currentUser= req.body.currentUser;
    let friends= await findUsers(user,currentUser);
    res.send(friends);
  })
  app.post("/request", async function(req,res){
    console.log(req.body.username);
    let user= req.body.username;
    let user2= req.body.username2;
    await requestFriend(user,user2);
    let friends= await findUsers(user);
    res.send(friends);
  })

  app.post("/addConversation", async function (req,res){
    let user= req.body.username;
    let user2= req.body.username2;
    await addConversation(user,user2);
  })
  app.post('/getHistory', async function(req,res){
    let user= req.body.userfrom;
    let user2 = req.body.userto;
    let convos = await getHistory(user,user2);
    res.send(convos);
  })

// Start the server
const port = 5000; 
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
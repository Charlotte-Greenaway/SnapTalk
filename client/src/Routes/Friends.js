import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import './css/Friends.css';

const Friends = () =>{

    const [friends, setFriends] = useState([""]);
    const [requested, setRequested] = useState([""]);
    const [searchFriends,setSearchFriends]= useState([""]);

    //handle friend search
    const searchDatabase = debounce((searchTerm) => {
      axios.post("http://localhost:5000/getUsers", { username: searchTerm,currentUser: localStorage.username})
      .then(data=>{
        console.log(data.data);
        setSearchFriends(data.data);
      })
      .catch(error=>console.log(error))
    },500)

    //get users current friends
    const getFriends = () => {
        axios.post("http://localhost:5000/getFriends", { username: localStorage.username })
          .then(data => {
            console.log("friends",data.data.friends, "requests",data.data.requests)
            if(data.data!==null){
              setFriends(data.data.friends);
              setRequested(data.data.requests)
            }else{
              setFriends(["No current Friends"])
            }
            
          })
          .catch(error => console.log(error));
      }

      const addCurrentFriend = (user) =>{
        axios.post("http://localhost:5000/request", { username: user, username2: localStorage.username})
          .then(data => {
            console.log(data.data)
            if(data.data!==null){
              //friends.push(data.data);
            }else{
              //setFriends(["No current Friends"])
            }
            getFriends();
          })
          .catch(error => console.log(error));
      }
    
      useEffect(() => {
        
          getFriends();
          searchDatabase("");
      }, []);

      //updates search 
      const updateSearch = (e) => {
        console.log(e.target.value)
        searchDatabase(e.target.value)
      }
      const addFriend = (e) => {
        console.log(e.target.value);
        addCurrentFriend(e.target.value);
      }

      
    return(
      <div id="friendspage">
        <div id="currFriendsSect">
          <div id="friendsheader">
            <h3>Current Friends</h3>
          </div>
          {friends.map((friend, index) => (
                <p key={index}>{friend}</p>
              ))}
        </div>
        <div id="findFriends">
            <div id="friendsheader">
              <h3>Add Friends</h3>
            </div>
            <input id="addFriend"  onChange={updateSearch} type="text"></input>
            {searchFriends
              .filter((friend) => !friends.includes(friend)) // Filter out friends already in the friends array
              .map((friend, index) => (
                <p key={index}>
                  {friend} <button onClick={addFriend} value={friend}>+</button>
                </p>
              ))}
        </div>
        <div id="friendRequests">
            <div id="friendsheader">
              <h3>Requests</h3>
            </div>
            {requested.map((friend, index) => (
                <p key={index}>{friend}<button onClick={addFriend}value={friend}>+</button></p>
              ))}
        </div>
      </div>
    )
}
export default Friends;
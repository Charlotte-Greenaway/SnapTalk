import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './css/TaskBar.css';
import useWebSocket from 'react-use-websocket';
import ConvoHeader from './ConvoHeader'
const WS_URL = 'ws://localhost:8080';


const SideBar = ({setMessageBox,mobSide,setMobSide}) => {
    const isMobile= (window.innerWidth<801);
    console.log(isMobile)
    const user = localStorage.username;
    const [coversations,setConversations]=useState(["No conversations"]);
    const [addConversation,setAddConvo]=useState(false);
    const [addButton,setAddButton]= useState("+");
    const [inputValue, setInputValue] = useState("");
    const [addConvoFriends, setACF] = useState([]);
    const {lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL+"/getConversationHeaders");
    useEffect(() => {
        sendJsonMessage({ user });
        const interval = setInterval(() => {
            sendJsonMessage({ user }); // Send the message as a JSON object
        }, 500); // Repeat every two seconds (2000 milliseconds)
    
        return () => {
          clearInterval(interval); // Clean up the interval on component unmount
        };
      }, []);

      useEffect(() => {
        if (lastJsonMessage !== null) {
          setConversations(lastJsonMessage);
        }
      }, [lastJsonMessage]);
    const addConvo = () => {
      axios.post("http://localhost:5000/getFriends", { username: localStorage.username, username2:inputValue})
      .then(data => {
        if(data.data!==null){
          setACF(data.data.friends);
        }else{
          setACF(["No current Friends"])
        }
      })
      .catch(error => console.log(error));
      setAddConvo(!addConversation);
      if (addButton=="+"){
        setAddButton("x");
      }else{
        setAddButton("+");
      }
    }
    const submitFriend = (e) => {
      e.preventDefault();
      console.log("input",inputValue);
      addConvo();
      axios.post("http://localhost:5000/addConversation", {username:localStorage.username, username2:inputValue})
      .catch(error => console.log(error));
    }
    const setTheMessage = (friend) => {
      setMessageBox(friend)
    }
    
    return(
        <>
        <div id={(mobSide)?"sidebar":"sidebarclosed"}>
            <div id="sidebarheader">
                <h2>Inbox</h2><button id ="addConvo" onClick={addConvo}>{addButton}</button>
            </div>
           <div id={(addConversation==true)?"displayAddConvo":"noneAddConvo"}>
            <p>Add convo</p>
            <form onSubmit={submitFriend}>
            <select name="addConvo" type="text" onChange={(e) => setInputValue(e.target.value)} required>
            <option value="" disabled>Select an option</option>
              {addConvoFriends.map((friend, index) => (
                <option key={index} value={friend}>{friend}</option>
              ))}
            </select>
              <input type="submit"/>
            </form>
           </div>
            {coversations.map((friend, index) => (
                <div key={index} onClick={() => {
                  setTheMessage(friend);
                  setMobSide(false)
                }}><ConvoHeader key={index} index = {index} friend={friend} /></div>
              ))}
        </div>
        </>
    )
}
export default SideBar;
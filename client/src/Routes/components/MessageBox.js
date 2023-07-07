import React,{useState, useEffect} from 'react';
import './css/MessageBox.css';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:8080';

const MessageBox = ({userfrom,userto}) => {
    const { sendJsonMessage } = useWebSocket(WS_URL+"/sendMessage");
    const {lastMessage, sendMessage } = useWebSocket(WS_URL+"/getHistory");
    const [currentMsg, setMsg] = useState("");
    const[messageArray, setMsgArr] =  useState([]);
    
    const submitMessage = (e) => {
        e.preventDefault();
        let date= new Date();
        sendJsonMessage({currentMsg, date, userfrom ,userto });
    }
    useEffect(() => {
        axios.post("http://localhost:5000/getHistory", { userfrom: userfrom, userto :userto })
        .then(data=>{
          setMsgArr(data.data);
        })
        .catch(error=>console.log(error))
      }, [userto]);

      
      useEffect(() => {
        const interval = setInterval(() => {
            sendMessage(JSON.stringify({ userfrom, userto })); // Send the message as a JSON object
        }, 200); // Repeat every two seconds (2000 milliseconds)
    
        return () => {
          clearInterval(interval); 
        };
      },[userto])
      useEffect(() => {
        if (lastMessage !== null) {
          //console.log()
          setMsgArr(JSON.parse(lastMessage.data))
        }
      }, [lastMessage]); 

    return(
        <div id="messageBox">
        <h3>{userto}</h3> 
        
        <div id="messages">
            {messageArray.map(item => (
              <p key={item}>{item[0]}  {item[1]}   {item[2]}</p>
            ))}
        </div>
        <form id="messageInput" onSubmit={submitMessage}>
            <input type="textarea" onChange={function (event){setMsg(event.target.value)}}></input>
            <input type="submit" />
        </form>
        </div>
    )
}
export default MessageBox;
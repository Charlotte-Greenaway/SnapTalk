import React,{useState, useEffect} from 'react';
import './css/MessageBox.css';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:8080';

const MessageBox = ({userfrom,userto,mobSide}) => {
    const { sendJsonMessage } = useWebSocket(WS_URL+"/sendMessage");
    const {lastMessage, sendMessage } = useWebSocket(WS_URL+"/getHistory");
    const [currentMsg, setMsg] = useState("");
    const[messageArray, setMsgArr] =  useState([]);
    
    const submitMessage = (e) => {
        e.preventDefault();
        const formToReset = document.getElementById('textbox');
        formToReset.value= "";
        let date= new Date();
        sendJsonMessage({currentMsg, date, userfrom ,userto });
    }
    useEffect(() => {
        axios.post("http://localhost:5000/getHistory", { userfrom: userfrom, userto :userto })
        .then(data=>{
          setMsgArr(data.data);
        })
        .catch(error=>console.log(error))
      }, [userto, userfrom]);
      
      useEffect(() => {
        const interval = setInterval(() => {
            sendMessage(JSON.stringify({ userfrom, userto })); // Send the message as a JSON object
        }, 200); // Repeat every two seconds (2000 milliseconds)
    
        return () => {
          clearInterval(interval); 
        };
      },[userto,sendMessage, userfrom])
      useEffect(() => {
        if (lastMessage !== null) {
          let currentArray= messageArray.length;
          setMsgArr(JSON.parse(lastMessage.data));
          if(JSON.parse(lastMessage.data).length !== currentArray){
            setTimeout(() => {
              document.getElementById("bottomofmessages").scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }, 500);
          }
        }
      }, [lastMessage,messageArray.length]); 

    return(
        <div id={(mobSide)?"messageBoxClosed":"messageBox"}>
        <h3>{userto}</h3> 
        
        <div id="messages">
            {messageArray.map(item => (
              <>
              <small>{item[2]}</small>
              <div className={(item[2]===localStorage.username)?"userfrom":"userto"} key={item +"1"}><p key={item +"2"} >{item[0]} <br></br> <small>{item[1]}</small></p></div>
              </>
            ))}
            <div id="bottomofmessages" />
        </div>
        <form id="messageInput" onSubmit={submitMessage}>
            <input type="textarea" id="textbox" placeholder='Enter message here ...' onChange={function (event){setMsg(event.target.value)}}></input>
            <input type="submit" />
        </form>
        </div>
    )
}
export default MessageBox;
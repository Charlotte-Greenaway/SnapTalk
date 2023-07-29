import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import SideBar from './components/SideBar';
import Friends from './Friends';
import MessageBox from './components/MessageBox';
import GreetPage from './components/Greetpage'
const MessageHome = () => {
  const [view, setView] = useState('inbox');
  const [mobSide,setMobSide]= useState(true);
  const [isMessageBox,setMessageBox] = useState(null);
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  return (
      <>
        <TaskBar view={view} setView={handleViewChange} setMobSide={setMobSide} mobSide={mobSide}/>
        {view === 'inbox' && (
          <div id="messageHome">
            <SideBar setMessageBox={setMessageBox} mobSide={mobSide} setMobSide={setMobSide}/>
            {isMessageBox !== null && <MessageBox userfrom ={localStorage.username} userto={isMessageBox} mobSide={mobSide}/>}
            {isMessageBox === null && <GreetPage mobSide={mobSide}/>}
          </div>
        )}
        {view === 'friends' && <Friends />}
        {view === 'settings' && <p>settings</p>}
      </>
    
  
  );
};

export default MessageHome;

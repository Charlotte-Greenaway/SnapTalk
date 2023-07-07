import React, { useState } from 'react';
import TaskBar from './components/TaskBar';
import SideBar from './components/SideBar';
import Friends from './Friends';
import axios from 'axios';
import MessageBox from './components/MessageBox';

const MessageHome = () => {
  const [view, setView] = useState('inbox');
  const [isMessageBox,setMessageBox] = useState(null);
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  return (
    
      <>
        <TaskBar view={view} setView={handleViewChange} />
        
        {view === 'inbox' && (
          <div id="messageHome">
            <SideBar setMessageBox={setMessageBox} />
            {isMessageBox !== null && <MessageBox userfrom ={localStorage.username} userto={isMessageBox} />}
            {isMessageBox === null && <p>Welcome  {localStorage.username} !</p>}
          </div>
        )}
        {view === 'friends' && <Friends />}
        {view === 'settings' && <p>settings</p>}
      </>
    
  
  );
};

export default MessageHome;

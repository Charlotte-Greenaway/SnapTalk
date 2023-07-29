import React, { useState } from 'react';
import './css/TaskBar.css';

const TaskBar = ({ view,setView,setMobSide,mobSide }) => {
    
  const setTheView = (view) => {
    setView(view);
  };
  const toggleSide = () =>{
    setMobSide(!mobSide)
  }

  return (
    <div id="taskbar">
      <nav>
        <ul>
          <li><button onClick={toggleSide} id={(view==="inbox")?"mobButton":"mobClosed"}>x</button></li>
          <li className={view==="inbox"?"active":null}><button onClick={() => setTheView("inbox")}>Inbox</button></li>
          <li className={view==="friends"?"active":null}>
            <button onClick={() => setTheView("friends")}>Friends</button>
          </li>
          <li className={view==="settings"?"active":null}><button onClick={() => setTheView("settings")}>Settings</button></li>
        </ul>
      </nav>
    </div>
  );
};

export default TaskBar;

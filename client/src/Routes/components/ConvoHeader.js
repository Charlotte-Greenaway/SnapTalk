import React from 'react';
import './css/TaskBar.css'
const ConvoHeader = ({friend, index}) => {
    return(
        <div className="chatHead">
            <p key ={index}>{friend}</p>
        </div>
    )
}
export default ConvoHeader;
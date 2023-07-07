import React, {useState,useEffect}from 'react';
import Login from './LoginPage'
import MsgHome from './MessageHome'

const Home = () => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [loginInitial,setLoginInitial]= useState(false);

    useEffect(() => {
        // Check if the login state is stored in localStorage
        const storedLoginState = localStorage.getItem('isLoggedIn');
        if (storedLoginState) {
          setIsLoggedIn(JSON.parse(storedLoginState));
        }
        setLoginInitial(true);
      }, []);

    if (!loginInitial) {
    return null; // Render nothing until login state is initialized
    }
    const logout = () =>{
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', JSON.stringify(false));
        localStorage.setItem('username', JSON.stringify(""));
    }

    return (
        <>
          {isLoggedIn ? (
            <>
              <button id="logOut" onClick={logout}>Log Out</button>
              <MsgHome/>
              
            </>
          ) : (
            <>
              <Login setLogin={setIsLoggedIn} />
            </>
          )}
        </>
      );
   
}
export default Home;
import './css/greet.css';

const Greetpage = ({mobSide}) => {
    return(
        <>
        <div id={(mobSide)?"greetclosed":"greet"}>
        <h3>Hi there, {localStorage.username}! Great to see you again.</h3>
        </div>
        </>
        
    )
}
export default Greetpage;
import { useNavigate } from "react-router-dom";
import './Navbar.scss'
function Navbar(){
    const navigate=useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    const handleSettings = () => {
        navigate('/setpreferences');
    }
    return (
        <div className="app__navbar">
            <div className="app__navbar-logo">
                <h2>Buyer</h2>
            </div>
            <div className="app__navbar-button">
                <button onClick={handleSettings}>Set Preferences</button>
                <button 
                className="ml-2"
                onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )

}
export default Navbar;
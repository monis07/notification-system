import {useNavigate} from 'react-router-dom'

import './Authentication.scss'

function Authentication(){
    const navigate=useNavigate();
    const handleSignup=()=>{
            navigate('/signup')
    }
    const handleSignin=()=>{
        navigate('/signin')
    }
    return (
        <>
        <div className='app__auth'>
            <div className='app__auth-intro'>
            <h1>Seller Authentication for Notification System</h1>
            </div>
            
            <div className='app__auth-button'>
            <button onClick={handleSignin}>SignIn</button>
            <button onClick={handleSignup}>SignUp</button>
            </div>
        </div>
        </>
    )
}

export default Authentication

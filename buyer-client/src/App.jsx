import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Authentication from './components/Authentication/Authentication'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import Products from './components/Products/Products'
import Setpreference from './components/Setpreference/Setpreference'
function App(){
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Authentication/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/setpreferences' element={<Setpreference/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
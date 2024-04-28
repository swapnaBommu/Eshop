import './App.css';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import {Toaster} from 'react-hot-toast';
import ProductDetails from './components/product/ProductDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center"/>
        <Header />
        <div className="container">
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/product/:id' element={<ProductDetails />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/me/profile' element={<Profile />}></Route>
            <Route path='/me/update_profile' element={<UpdateProfile />}></Route>

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

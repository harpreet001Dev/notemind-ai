import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import { PrivateRoutes } from './components/PrivateRouters';

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={
        <PrivateRoutes auth>
          <Register/>
        </PrivateRoutes>
      }/>
      <Route path='/login' element={
        <PrivateRoutes auth>
          <Login/>
        </PrivateRoutes>
      }/>
      <Route path='/' element={
        <PrivateRoutes>
          <Notes/>
        </PrivateRoutes>
      }/>
      <Route path='/notes' element={
        <PrivateRoutes>
          <Notes/>
        </PrivateRoutes>
      }/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
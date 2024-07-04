import { Route, Routes } from 'react-router-dom';
import UserLogin from './pages/user/UserLogin';

function App() {

  return (
    <>
      {/* user routes */}
      <Routes>
        <Route path='/login' element={<UserLogin />} />
      </Routes>


      {/* admin routes */}



      {/* theaters routes */}
    </> 
  )
}

export default App

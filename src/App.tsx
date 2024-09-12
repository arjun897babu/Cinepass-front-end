import { Route, Routes } from 'react-router-dom';
import { AdminRoutes,TheatersRoutes,UserRoutes } from './routes';
import './App.css'
function App() {

  return (
    <> 
      <Routes>

        {/* user routes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* theaters routes */}
        <Route path="/theaters/*" element={<TheatersRoutes />} />
 
      </Routes>

    </>
  )
}

export default App

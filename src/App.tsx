import { Route, Routes } from 'react-router-dom';
import { UserRoutes, AdminRoutes, TheatersRoutes } from './routes';
import {Loader} from './component/Loader'

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
        <Route path="/lod" element={<Loader />} />


      </Routes>

    </>
  )
}

export default App

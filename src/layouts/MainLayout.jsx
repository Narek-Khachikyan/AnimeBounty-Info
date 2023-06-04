import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header"


const MainLayout = () => {
  return (
    <div className='Wrapper'>
      <Header />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout


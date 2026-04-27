import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header"
import OfflineNotice from "../components/OfflineNotice/OfflineNotice"
import ServiceWorkerUpdateNotice from "../components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice"
import './layout.scss'

const MainLayout = () => {
  return (
    <div className='Wrapper'>
      <Header />
      <ServiceWorkerUpdateNotice />
      <OfflineNotice />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

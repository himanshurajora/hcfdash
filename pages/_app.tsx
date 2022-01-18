import SideBar from '../components/SideBar/SideBar'
import '../styles/globals.css'
import Navbar from '../components/Navbar/Navbar'
function MyApp({ Component, pageProps }) {
  return (
    <>
    <Navbar></Navbar>
      <div className="columns is-fullheight">
        <div className="column is-2  is-sidebar-menu is-hidden-mobile">
          <SideBar></SideBar>
        </div>
        <div className="column is-main-content">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}

export default MyApp

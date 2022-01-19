import SideBar from '../components/SideBar/SideBar'
import '../styles/globals.css'
import Navbar from '../components/Navbar/Navbar'
import { useRouter } from 'next/router'
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      {
        router.pathname === '/login' ?
          <>
          <Component {...pageProps} />
          </> :
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
      }
    </>
  )
}

export default MyApp

import { useRouter } from "next/router"
import { useState } from "react"
import { useCookies } from "react-cookie"
export default function Navbar() {

    const router = useRouter()
    // cookie with remove function
    const [cookie, setCookie, remove] = useCookies(['token'])
    const [isFullScreen, setIsFullScreen] = useState(false)
    const handleLogout = () => {
        remove('token')
        router.push('/login')
    }

    return (
        <>
            <nav className="navbar is-dark">
                <div className="navbar-brand">
                    <div className="navbar-item">HCF Dashboard</div>
                </div>
                <div className="navbar-end">
                    {/* Full Screen Focus Mode Button */}
                    <div className="navbar-item">
                        <button className="button is-primary" onClick={() => {
                            // Full Screen Focus Mode
                            if(isFullScreen) {
                                document.exitFullscreen()
                            } else {
                                document.documentElement.requestFullscreen()
                            }
                            setIsFullScreen(!isFullScreen)
                        }}>
                            {
                                isFullScreen ?
                                "Exit Focus Mode" :
                                "Enter Focus Mode"
                            }
                        </button>
                    </div>

                    <div className="navbar-item">
                        <button className="button is-danger" onClick={handleLogout}>LogOut</button>
                    </div>
                </div>
            </nav>
        </>
    )
}
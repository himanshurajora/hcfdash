import axios from "axios"
import { FormEvent } from "react"
import { useCookies } from "react-cookie"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"
export default function Login(props) {
    const [cookies, setCookie] = useCookies(['token'])
    const router = useRouter()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        // login only with token 
        const token = formData.get("token")
        // verify the token with api
        const result = axios.post(`/api/verify`, {
            token
        })
        // handle toast
        toast.promise(result, {
            loading: 'Logging in...',
            success: () => {
                setCookie('token', token, { path: '/' })
                router.push('/')
                return 'Successfully logged in'
            },
            error: (err) => { console.log(err.message); return 'Invalid Token Or Server Error' }
        }, {duration: 500})
    }
    return (
        <>
            <Toaster></Toaster>
            <section className="hero is-primary is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                                <form method="POST" onSubmit={handleLogin} className="box">
                                    <div className="field">
                                        <label className="label">Email</label>
                                        <div className="control has-icons-left">
                                            <input type="text" name="token" className="input" required />
                                            <span className="icon is-small is-left">
                                                🔐
                                            </span>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <button className="button is-success">
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


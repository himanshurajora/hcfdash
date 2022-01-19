import axios from "axios"
import { useEffect } from "react"
import { CookiesProvider } from "react-cookie"
import { useCookies } from "react-cookie"
import toast, { Toaster } from "react-hot-toast"
import { Router, useRouter } from "next/router"
export default function Container(props) {

    const [cookies, setCookie] = useCookies(['token'])
    // verify the access token
    const router = useRouter()
    useEffect(() => {
        if (cookies.token) {
            axios.post("/api/verify", {
                token: cookies.token
            }).then(res => {
                if (res.data.message !== "Token verified") {
                   // show toast
                    toast.error(res.data.message)
                } 
            }).catch((err) => {
                // push to login page
                router.push("/login")
            })
        }else{
            // push router to login
            router.push("/login")
        }
    }, [])



    return (
        <CookiesProvider>
            <div className="container notification my-3">
                {props.children}
            </div>
            <Toaster></Toaster>
        </CookiesProvider>
    )
}

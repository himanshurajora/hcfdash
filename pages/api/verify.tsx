import { isVerified } from "../../lib/auth";

// function to verify the access token
export default function handler(req, res){
    const { token } = req.body;
    if(!token){
        res.status(401).send({message: "Please enter token"})
    }else{
        if(isVerified(token)){
            res.send({message: "Token verified"})
        }else{
            res.status(401).send({message: "Token is not valid"})
        }
    }
}
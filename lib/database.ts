import mysql from 'serverless-mysql'
export default mysql({
    config: {
        host: "localhost",
        user: "root",
        password: "",
        database: "hcfdash"
    }
})

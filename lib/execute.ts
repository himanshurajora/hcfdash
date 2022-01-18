import db from "./database"

export default function (query: string, params: any[] = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}


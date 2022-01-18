import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'

// delete the herb with the given id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { id } = req.body
        try {
            const result = await Execute(`DELETE FROM herbs WHERE id = ${id}`)
            res.status(200).json({ message: "Herb deleted successfully", result })
        } catch (err) {
            console.log("this is the error", err)
            res.status(500).json({ message: "Error deleting herb", err })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



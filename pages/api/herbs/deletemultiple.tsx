import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addHerbHistory } from "../../../lib/herbHistory";
// delete multiple herbs with the given ids
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { selectedHerbs } = req.body
        try {
            const result = await Execute(`DELETE FROM herbs WHERE id IN (${selectedHerbs})`)
            // add a history to the herb
            // Not doing this for now
            res.status(200).json({ message: "Herbs deleted successfully", result })
        } catch (err) {
            console.log("this is the error", err)
            res.status(500).json({ message: "Error deleting herbs", err })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



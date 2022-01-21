import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addHerbHistory } from "../../../lib/herbHistory";
// delete the herb with the given id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { id } = req.body
        try {
            // get the herb name by id
            var herb :any = await Execute(`select * from herbs where id = '${id}'`)
            const herb_name = herb[0].name
            // add the herb to the herbs_history table
            const herb_id = null
            const quantity = herb[0].quantity
            const message = `Deleted`
            const purchase_id = null
            await addHerbHistory(herb_id, herb_name, quantity, message, purchase_id)
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



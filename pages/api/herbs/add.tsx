import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addHerbHistory } from "../../../lib/herbHistory";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, botanical_name, unit, quantity, reorder_level, purchase_price, selling_price } = req.body
        try {
            const result : any = await Execute(`INSERT INTO herbs (name, botanical_name, unit, quantity, reorder_level, purchase_price, selling_price) VALUES ('${name}', '${botanical_name}', '${unit}', '${quantity}', '${reorder_level}', '${purchase_price}', '${selling_price}')`)
            // add the herb to the herbs_history table
            const herb_id = result.insertId
            const herb_name = name
            const message = `Added`
            const purchase_id = null
            await addHerbHistory(herb_id, herb_name, quantity, message, purchase_id)
            res.status(200).json({ message: "Herb added successfully", result })
        } catch (err) {
            console.log("this is the error", err)
            res.status(500).json({ message: "Error adding herb", err })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



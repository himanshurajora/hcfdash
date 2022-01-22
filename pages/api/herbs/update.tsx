import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addHerbHistory } from "../../../lib/herbHistory";
// update the herb with the given details
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, botanical_name, unit, quantity, reorder_level, purchase_price, selling_price, id } = req.body
        try {
            // update query 
            const result = await Execute(`UPDATE herbs SET name = '${name}', botanical_name = '${botanical_name}', unit = '${unit}', quantity = '${quantity}', reorder_level = '${reorder_level}', purchase_price = '${purchase_price}', selling_price = '${selling_price}' WHERE id = ${id}`)
            // add a history to the herb
            console.log(id, name, quantity, "Updated", null)
            await addHerbHistory(id, name, quantity, "Updated", null)
            res.status(200).json({ message: "Herb updated successfully", result })
        } catch (err) {
            console.log("this is the error", err)
            res.status(500).json({ message: "Error updating herb", err })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}




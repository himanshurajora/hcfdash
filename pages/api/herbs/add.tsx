import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, botanical_name, unit, quantity, reorder_level, purchase_price, selling_price } = req.body
        try {
            const result = await Execute(`INSERT INTO herbs (name, botanical_name, unit, quantity, reorder_level, purchase_price, selling_price) VALUES ('${name}', '${botanical_name}', '${unit}', '${quantity}', '${reorder_level}', '${purchase_price}', '${selling_price}')`)
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



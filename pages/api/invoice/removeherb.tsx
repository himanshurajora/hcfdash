import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'


// a function to remove a single herb from an existing invoice
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { purchase_id, herb_id, quantity } = req.body
        try {
            // substract the quantity from the herbs table
            const update_quantity = await Execute(`update herbs set quantity = quantity - ${quantity} where id = '${herb_id}'`)
            // remove the herb from the purchase_herbs table
            const update_purchase_herbs = await Execute(`delete from purchase_herbs where purchase_id = '${purchase_id}' and herb_id = '${herb_id}'`)
            res.status(200).json({
                message: "Invoice updated successfully"
            })
        }
        catch (err) {
            res.status(500).json({
                message: "Error updating invoice"
            })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



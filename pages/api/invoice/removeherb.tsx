import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'


// a function to remove a single herb from an existing invoice
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { purchase_id,id,  herb_id, quantity, price } = req.body
        try {
            // substract the quantity from the herbs table
            const update_quantity = await Execute(`update herbs set quantity = quantity - ${quantity} where id = ${id}`)
            console.log(req.body)
            // remove the herb from the purchase_herbs table
            const update_purchase_herbs = await Execute(`delete from purchase_herbs where purchase_id = '${purchase_id}' and id = '${herb_id}'`)
            // update the total price and updated_at fields in the purchases table
            const update_purchase = await Execute(`update purchases set total_amount = total_amount - ${price}, updated_at = now() where id = '${purchase_id}'`)
            res.status(200).json({
                message: "Invoice updated successfully"
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: "Error updating invoice"
            })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



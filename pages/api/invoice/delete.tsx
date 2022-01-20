import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'

// a function to delete an existing invoice and all the herbs added to it
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {purchase_id } = req.body
        try {
            // get the previous quantity of each herb
            const previous_quantity = await Execute(`select herb_id, quantity from purchase_herbs where purchase_id = '${purchase_id}'`)
            // substract the previous quantity from the current quantity
            // loop through the list of herbs
            for (const herb in previous_quantity as any) {
                // get the herb id
                const herb_id = previous_quantity[herb].herb_id
                // get the quantity
                const quantity = previous_quantity[herb].quantity
                // update the quantity in the herbs table
                const update_quantity = await Execute(`update herbs set quantity = quantity - ${quantity} where id = '${herb_id}'`)
            }
            // now delete all the herbs from the purchase_herbs table where the purchase_id is the same as the one passed in the request
            const delete_purchase_herbs = await Execute(`delete from purchase_herbs where purchase_id = '${purchase_id}'`)
            // now delete the purchase from the purchases table
            const delete_purchase = await Execute(`delete from purchases where id = '${purchase_id}'`)

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



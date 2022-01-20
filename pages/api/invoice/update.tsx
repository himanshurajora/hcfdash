import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'


// a function to update existing invoice, and add list of herbs to it, and quantity of each herb added to existing quantity of herb
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {invoice_no, remarks, total_amount, herbsList, purchase_id } = req.body
        try {
            const purchases = await Execute(`update purchases set remarks = '${remarks}', total_amount = ${total_amount}, invoice_no = ${invoice_no} where id = '${purchase_id}'`)
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
            // now loop through the list of herbs
            for (const herb in herbsList as any) {
                // get the herb id
                const herb_id = herbsList[herb].herb_id
                // get the quantity
                const quantity = herbsList[herb].quantity
                // update the quantity in the herbs table
                const update_quantity = await Execute(`update herbs set quantity = quantity + ${quantity} where id = '${herb_id}'`)
                // update the quantity and purchase_price in the purchase_herbs table
                const update_purchase_herbs = await Execute(`update purchase_herbs set quantity = ${quantity}, purchase_price = ${herbsList[herb].purchase_price} where purchase_id = '${purchase_id}' and herb_id = '${herb_id}'`)
            }
        
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



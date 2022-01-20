import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'


// a function to create invoice, and add list of herbs to it, and quantity of each herb added to existing quantity of herb
declare interface IHerb {
    id: number,
    name: string,
    quantity: number
    purchase_price: number
}
declare interface IHerbs {
    [key: string]: IHerb
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { date, invoice_no, remarks, total_amount, herbsList } = req.body
        try {
            // date, invoice_no, remarks and created_at, updated_at are auto added by mysql
            // there is a purchases table 

            const purchases = await Execute(`insert into purchases (purchase_date, remarks, invoice_no, total_amount, product_type) values ('${date}', '${remarks}', '${invoice_no}', ${total_amount}, 'Herbs')`)
            // now insert into purchases_herbs table
            // the details of each herb is in the array of herbs_list

            // first get the id of the purchase inserted from the variable purchases
            const purchase_id = (purchases as any).insertId

            // now add the list of herbs to the purchases_herbs table
            // query to insert all herbs to the purchases_herbs table

            var query = `insert into purchase_herbs (purchase_id, herb_id, herb_name, quantity, purchase_price) values `
            // loop through the list of herbs
            for (const herb in herbsList) {
                // get the herb id
                const herb_id = herbsList[herb].id
                // get the quantity
                const quantity = herbsList[herb].quantity
                // get the purchase price
                const purchase_price = herbsList[herb].purchase_price
                // get the herb name
                const herb_name = herbsList[herb].name
                // add to the query
                query += `(${purchase_id}, ${herb_id}, '${herb_name}', ${quantity}, ${purchase_price}),`
            }
            // remove the last comma
            query = query.slice(0, -1)
            // execute the query
            const purchases_herbs = await Execute(query)
            // now update the current quantity of each herb in the herbs table
            // query to update the quantity of each herb
            // loop through the list of herbs
            for (const herb in herbsList) {
                // get the herb id
                const herb_id = herbsList[herb].id
                // get the quantity
                const quantity = herbsList[herb].quantity
                // get the purchase price
                const purchase_price = herbsList[herb].purchase_price
                // get the herb name
                const herb_name = herbsList[herb].name
                // update the quantity of each herb
                const update_quantity = await Execute(`update herbs set quantity = quantity + ${quantity} where id = ${herb_id}`)
            }
            // return the response
            res.status(200).json({
                success: true,
                message: "Invoice added successfully"
            })
        } catch (err) {
            console.log("this is the error", err)
            res.status(500).json({ message: "Error adding herb", err })
        }
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}



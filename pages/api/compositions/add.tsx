import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addCompositionHistory } from "../../../lib/compositionHistory";

// function to handle add composition request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { code, name, formulaQuantity, herbsList} = req.body
        try {
            // add the composition to compositions table
            const composition : any = await Execute(`INSERT INTO compositions (code, name, formula_quantity) VALUES ('${code}', '${name}', ${formulaQuantity})`)
            // get composition id
            const compositionId = composition.insertId
            // add herbList to composition_herbs table
            for (const herb of herbsList) {
                const herbId = herb.id
                const herbName = herb.name
                const quantity = herb.quantity

                // add to composition_herbs table
                await Execute(`INSERT INTO composition_herbs (composition_id, herb_id, herb_name, quantity) VALUES (${compositionId}, ${herbId}, '${herbName}', ${quantity})`)
                // add to composition_herb_history table
                await addCompositionHistory(compositionId, herbId, herbName, quantity, "Added To Composition")
            }

            res.status(200).json({
                success: true,
                message: "Composition added successfully"
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



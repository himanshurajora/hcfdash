import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { addCompositionHistory } from "../../../lib/compositionHistory";

// function to udpate composition
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { code, name, formulaQuantity, herbsList, composition_id} = req.body
        try {
            // update the composition to compositions table
            await Execute(`UPDATE compositions SET code = '${code}', name = '${name}', formula_quantity = ${formulaQuantity} WHERE id = ${composition_id}`)
            // delete all children from composition_herbs table
            await Execute(`DELETE FROM composition_herbs WHERE composition_id = ${composition_id}`)
            // add herbList to composition_herbs table
            for (const herb of herbsList) {
                const herbId = herb.id
                const herbName = herb.herb_name
                const quantity = herb.quantity

                // add to composition_herbs table
                await Execute(`INSERT INTO composition_herbs (composition_id, herb_id, herb_name, quantity) VALUES (${composition_id}, ${herbId}, '${herbName}', ${quantity})`)
                // add to composition_herb_history table
                await addCompositionHistory(composition_id, herbId, herbName, quantity, "Updated Composition")
            }
            
            res.status(200).json({
                success: true,
                message: "Composition updated successfully"
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



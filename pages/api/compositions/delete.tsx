import { NextApiRequest, NextApiResponse } from "next";
import Execute from '../../../lib/execute'
import { removeCompositionHistory } from "../../../lib/compositionHistory";

// function to delete composition
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { composition_id} = req.body
        try {
            // delete all children from composition_herbs table
            await Execute(`DELETE FROM composition_herbs WHERE composition_id = ${composition_id}`)
            // delete composition from compositions table
            await Execute(`DELETE FROM compositions WHERE id = ${composition_id}`)
            // add to composition_herb_history table
            await removeCompositionHistory(composition_id)

            res.status(200).json({
                success: true,
                message: "Composition deleted successfully"
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



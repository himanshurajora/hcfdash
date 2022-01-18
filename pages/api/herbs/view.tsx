import { NextApiRequest, NextApiResponse } from "next";
import mysql from 'serverless-mysql'
import database from "../../../lib/database";
import Execute from '../../../lib/execute'

// Function to list all herbs
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        database.query(`SELECT * FROM herbs`)
            .then(result => {
                res.status(200).json({ message: "Herbs listed successfully", result })
            })
            .catch(err => {
                res.status(500).json({ message: "Error listing herbs", err })
            })
    } else if (req.method === "POST") {
        const { id } = req.body
        database.query(`SELECT * FROM herbs WHERE id = ${id}`)
            .then(result => {
                res.status(200).json({ message: "Herb listed successfully", result })
            })
            .catch(err => {
                res.status(500).json({ message: "Error listing herb", err })
            })
    } else {
        // Bad Request
        res.status(400).json({ message: "Bad Request" })
    }
}

import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import Container from "../../../components/Container/Container";
import toast, { Toaster } from "react-hot-toast";
import database from "../../../lib/database";
import Autocomplete from "react-autocomplete";
import { useRouter } from "next/router";

export default function EditInvoice({ data }) {
    const [herbsList, setHerbsList] = useState(data.herbsList);
    const [totalAmount, setTotalAmount] = useState(0);
    const router = useRouter()
    console.log(data);
    useEffect(() => {
        // set the total amount
        if (herbsList.length !== 0) {
            if (herbsList.length === 1) {
                setTotalAmount(herbsList[0].purchase_price ? parseFloat(herbsList[0].purchase_price) : 0)
            } else {
                setTotalAmount(herbsList.reduce((prev, curr) => parseFloat(prev.purchase_price) + parseFloat(curr.purchase_price)))
            }
        } else {
            setTotalAmount(0)
        }
        console.log(herbsList)
    }, [herbsList])

    // !Fix - By Mistake in this function i names herb_id - id and id - herb_id
    // But don't fix it, it will work fine, but it will be confusing for the developer
    const handleDeleteHerb = async (purchase_id, herb_id, id, index, price) => {
        // send post request to /api/invoice/removeherb
        if (confirm("Are you sure you want to delete this herb?")) {
            const response = axios.post("/api/invoice/removeherb", {
                purchase_id,
                herb_id,
                id,
                quantity: data.herbsList[index].quantity,
                price
            })
            // toast the response
            toast.promise(response, {
                loading: "Removing herb...",
                success: () => {
                    // update the herbsList
                    const newHerbsList = [...herbsList]
                    newHerbsList.splice(index, 1)
                    setHerbsList(newHerbsList)
                    return "Herb removed successfully"
                },
                error: "Error removing herb"
            })

        } else {
            // toast 
            toast.error("Herb not removed, It might be a mistake")
        }
    }

    const handleUpdateInvoice = async (e: FormEvent) => {
        e.preventDefault()
        // get form data
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        // get invoice_no
        const invoice_no = formData.get("invoice_no")
        // get remarks
        const remarks = formData.get("remarks")
        // total amount
        // from the addtion of all the purchase price in herbs_list
        var total_amount = 0;
        herbsList.map((herb) => {
            total_amount += parseInt(herb.purchase_price)
        })

        var result
        try {
            result = axios.post('/api/invoice/update', {
                "purchase_id": data.purchase_id,
                invoice_no,
                remarks,
                total_amount,
                herbsList
            })
            toast.promise(result, {
                loading: 'Adding purchase...',
                success: 'Successfully added purchase',
                error: (err) => { console.log(err.message); return 'Error.. Make Sure Invoice No. Is Unique' }
            });
        } catch (err) {
            console.log(result)
        }

    }

    return (
        <Container>
            <div className="title">
                Edit Invoice
            </div>
            <h1 className="title is-4">Add Inventory</h1>
            <div className="columns">
                <div className="column is-12">
                    <form className="form" onSubmit={handleUpdateInvoice}>
                        <div className="columns">
                            <div className="column is-6 is-12-mobile">
                                <div className="field">
                                    <label className="label is-small">
                                        Date
                                    </label>
                                    <div className="control">
                                        <input type="text" defaultValue={
                                            // convert data.purchase_date to dd-mm-yyyy
                                            data.purchase_date ?
                                                data.purchase_date.split('T')[0].split('-').reverse().join('-')
                                                :
                                                ''
                                        } className="input" disabled name="date" />
                                    </div>
                                </div>
                            </div>
                            <div className="column is-6 is-12-mobile">
                                <div className="field">
                                    <label className="label is-small">
                                        Invoice No.
                                    </label>
                                    <div className="control">
                                        <input type="text" className="input"
                                            defaultValue={
                                                data.invoice_no
                                            }
                                            name="invoice_no" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Remarks
                            </label>
                            <div className="control">
                                <textarea className="textarea" rows={1} name="remarks"
                                    defaultValue={
                                        data.remarks
                                    }
                                    required></textarea>
                            </div>
                        </div>
                        <hr />
                        {/* The table of herbs to buy */}
                        <div className="columns">
                            <div className="column is-12">
                                <table className="table is-fullwidth is-striped is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>Herb Name</th>
                                            <th>Qty.</th>
                                            <th>P.R.</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {herbsList.map((herb, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="field">
                                                            <div className="control">
                                                                {/* Autocomplete for name field */}
                                                                <input type="text" className="input"
                                                                    disabled={true}
                                                                    defaultValue={
                                                                        herb.herb_name
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="field">
                                                            <div className="control">
                                                                <input type="number" className="input" name="quantity" value={herb.quantity}
                                                                    onChange={(e) => {
                                                                        var newHerbsList = [...herbsList];
                                                                        newHerbsList[index].quantity = e.target.value;
                                                                        setHerbsList(newHerbsList);
                                                                    }}
                                                                    required />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="field">
                                                            <div className="control">
                                                                <input type="number" className="input" name="purchase_price" value={herb.purchase_price} onChange={(e) => {
                                                                    herbsList[index].purchase_price = e.target.value;
                                                                    setHerbsList([...herbsList])
                                                                }} required />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button type="button" className="button is-small is-warning" onClick={() => {
                                                            handleDeleteHerb(data.purchase_id, herb.id, herb.herb_id, index, herb.purchase_price)
                                                        }}>
                                                            <span className="icon">
                                                                ❌
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Button to add new herb item */}
                        <div className="buttons">
                            <button className="button" disabled>
                                Total Amount: {totalAmount}
                            </button>
                        </div>

                        <hr />
                        <div className="field">
                            <div className="control">
                                <div className="buttons">
                                    <button type="submit" className="button is-success">
                                        Save
                                    </button>
                                    <button type="button" className="button is-danger" onClick={() => {
                                        router.back()
                                    }}>
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div >

        </Container >
    )
}


export async function getServerSideProps(context) {

    // get the invoice data by id
    const result: any = await database.query(`SELECT * FROM purchases WHERE id = ${context.query.id}`)
    // get the herbs data by this invoice id
    const herbsResult: any = await database.query(`SELECT * FROM purchase_herbs WHERE purchase_id = ${context.query.id}`)
    const herbsAutoCompleteList: any = await database.query(`SELECT * FROM herbs`)
    // convert result to json
    var data: any = {}
    data.date = result[0].date;
    data.invoice_no = result[0].invoice_no;
    data.remarks = result[0].remarks;
    data.total_amount = result[0].total_amount;
    data.purchase_date = result[0].purchase_date
    data.purchase_id = context.query.id;
    data.herbsList = JSON.parse(JSON.stringify(herbsResult));
    data.herbsAutoCompleteList = JSON.parse(JSON.stringify(herbsAutoCompleteList));
    data = JSON.parse(JSON.stringify(data));

    database.end()
    return {
        props: {
            data
        }
    }
}

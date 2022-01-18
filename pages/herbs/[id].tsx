import axios from "axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { FormEvent, useRef } from "react"
import database from "../../lib/database"
import toast, { Toaster } from 'react-hot-toast'
export default function Edit({ data }) {
    const router = useRouter()
    const updateFormRef = useRef<HTMLFormElement>(null)
    const handleUpdateHerb = (e: FormEvent) => {
        e.preventDefault()
        const form = updateFormRef.current as HTMLFormElement
        const formData = new FormData(form)

        // get all the form data
        const name = formData.get("name")
        const botanical_name = formData.get("botanical_name")
        const unit = formData.get("unit")
        const quantity = formData.get("quantity")
        const reorder_level = formData.get("reorder_level")
        const purchase_price = formData.get("purchase_price")
        const selling_price = formData.get("selling_price")

        try {
            // update the herb
            const result = axios.post(`/api/herbs/update`, {
                name,
                botanical_name,
                unit,
                quantity,
                reorder_level,
                purchase_price,
                selling_price,
                id: router.query.id
            })
            // handle toast
            toast.promise(result, {
                loading: 'Updating herb...',
                success: 'Successfully updated herb',
                error: (err) => { console.log(err.message); return 'Error.. Make Sure To The Name is Unique' }
            })

        } catch (err) {
            console.log(err);
        }
    }

    return <>
        {/* Herb Edit Form */}
        <div className="container notification my-3">
            <div className="title">
                Herb Edit Form
            </div>
            <form className="form" ref={updateFormRef} onSubmit={handleUpdateHerb}>
                <div className="field">
                    <label className="label">
                        Name:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="name" defaultValue={data.name} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Botanical Name:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="botanical_name" defaultValue={data.botanical_name} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Unit:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="unit" defaultValue={data.unit} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Quantity:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="quantity" defaultValue={data.quantity} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Re-Order Level Inventory:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="reorder_level" defaultValue={data.reorder_level} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Purchase Price:
                    </label>
                    <div className="control">
                        <input type="text" className="input" defaultValue={data.purchase_price} name="purchase_price" required />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Selling Price:
                    </label>
                    <div className="control">
                        <input type="text" className="input" defaultValue={data.selling_price} name="selling_price" required />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button className="button is-primary">
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <Toaster></Toaster>
    </>
}


export async function getServerSideProps(context) {

    // get the herb data by id
    const result: any = await database.query(`SELECT * FROM herbs WHERE id = ${context.query.id}`)
    // convert result to json
    const data = JSON.parse(JSON.stringify(result))[0]
    return {
        props: {
            data
        }
    }
}
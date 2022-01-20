import axios from "axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { FormEvent, useRef } from "react"
import database from "../../lib/database"
import toast, { Toaster } from 'react-hot-toast'
import Container from "../../components/Container/Container"
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
        <Container>
            <div className="title">
                Herb Edit Form
            </div>
            <form className="form" ref={updateFormRef} onSubmit={handleUpdateHerb}>
                <div className="field">
                    <label className="label is-small">
                        Name:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="name" defaultValue={data.name} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Botanical Name:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="botanical_name" defaultValue={data.botanical_name} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Unit:
                    </label>
                    <div className="control">
                        <input type="text" className="input" name="unit" defaultValue={data.unit} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Quantity:
                    </label>
                    <div className="control">
                        <select className="input" name="unit" required>
                            <option value="g">gm</option>
                            <option value="kg">kg</option>
                            <option value="l">l</option>
                            <option value="ml">ml</option>
                        </select>
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Re-Order Level Inventory:
                    </label>
                    <div className="control">
                        <input type="number" className="input" name="reorder_level" defaultValue={data.reorder_level} required />
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Purchase Price:
                    </label>
                    <div className="control">
                        <input type="number" className="input" defaultValue={data.purchase_price} name="purchase_price" required />
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">
                        Selling Price:
                    </label>
                    <div className="control">
                        <input type="number" className="input" defaultValue={data.selling_price} name="selling_price" required />
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <div className="buttons">
                            <button className="button is-primary">
                                Update
                            </button>
                            <button className="button is-danger" onClick={(e) => { e.preventDefault(); router.push(`/herbs/view?search=${router.query.search ? router.query.search : ""}`) }}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Container>
    </>
}


export async function getServerSideProps(context) {

    // get the herb data by id
    const result: any = await database.query(`SELECT * FROM herbs WHERE id = ${context.query.id}`)
    // convert result to json
    const data = JSON.parse(JSON.stringify(result))[0]
    database.end()
    return {
        props: {
            data
        }
    }
}

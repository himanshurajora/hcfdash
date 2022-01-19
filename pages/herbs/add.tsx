import { FormEvent, useRef } from "react";
import axios from "axios";
import Container from "../../components/Container/Container";
import toast, { Toaster } from "react-hot-toast";

export default function AddHerbs() {

    const handleAddHerb = async (e: FormEvent) => {
        e.preventDefault()
        // get form data
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        // get name
        const name = formData.get("name")
        // get botanical name
        const botanical_name = formData.get("botanical_name")
        // get unit
        const unit = formData.get("unit")
        // quantity
        const quantity = formData.get("quantity")
        // get reorder level
        const reorder_level = formData.get("reorder_level")
        // finally get purchase price and selling price 
        const purchase_price = formData.get("purchase_price")
        const selling_price = formData.get("selling_price")
        var result
        try {
            result = axios.post('/api/herbs/add', {
                name,
                botanical_name,
                unit,
                quantity,
                reorder_level,
                purchase_price,
                selling_price
            })
            toast.promise(result, {
                loading: 'Adding herb...',
                success: 'Successfully added herb',
                error: (err) => { console.log(err.message); return 'Error.. Make Sure To The Name is Unique' }
            });

        } catch (err) {
            console.log(result)
        }
    }
    return (
        <Container>
            <h1 className="title is-4">Add Herb</h1>
            <div className="columns">
                <div className="column is-7">
                    <form className="form" onSubmit={handleAddHerb}>
                        <div className="field">
                            <label className="label is-small">
                                Name
                            </label>

                            <div className="control">
                                <input type="text" className="input" name="name" required />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label is-small">
                                Botanical Name:
                            </label>
                            <div className="control">
                                <input type="text" className="input" name="botanical_name" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Unit:
                            </label>
                            <div className="control">
                                <input type="text" className="input" name="unit" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Quantity:
                            </label>
                            <div className="control">
                                <input type="number" className="input" name="quantity" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Re-Order Level Inventory:
                            </label>
                            <div className="control">
                                <input type="number" className="input" name="reorder_level" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Purchase Price:
                            </label>
                            <div className="control">
                                <input type="number" className="input" name="purchase_price" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Selling Price:
                            </label>
                            <div className="control">
                                <input type="number" className="input" name="selling_price" required />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button className="button is-primary">
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Container>
    )
}
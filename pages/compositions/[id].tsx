// A react component for the add composition page.
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import Container from "../../components/Container/Container";
import toast, { Toaster } from "react-hot-toast";
import Autocomplete from "react-autocomplete";
import { useRouter } from "next/router";
import database from "../../lib/database";
export default function AddComposition({ data }) {
    const router = useRouter();
    const [herbsList, setHerbsList] = useState(data.herbsList);
    const [formulaQuantity, setFormulaQuantity] = useState(0);

    useEffect(() => {
        console.log(herbsList)
        // set the total formula quantity
        if (herbsList.length !== 0) {
            if (herbsList.length === 1) {
                setFormulaQuantity(herbsList[0].quantity ? parseFloat(herbsList[0].quantity) : 0)
            } else {
                setFormulaQuantity(herbsList.reduce((prev, curr) => parseFloat(prev.quantity) + parseFloat(curr.quantity)))
            }
        } else {
            setFormulaQuantity(0)
        }

    })

    const handleUpdateComposition = async (e: FormEvent) => {
        e.preventDefault();
        // get form data
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        // get code and name
        const code = formData.get("code") as string;
        const name = formData.get("name") as string;


        if (herbsList.length == 0) {
            toast.error('Add atleast one herb');
            return;
        } else {
            // push all the data to /api/compositions/update
                var result
                try {
                    result = axios.post('/api/compositions/update', {
                        code,
                        name,
                        formulaQuantity,
                        herbsList,
                        composition_id: data.id
                    })
                    toast.promise(result, {
                        loading: 'Updating Composition...',
                        success: () => {
                            setTimeout(() => {
                                // router.push('/herbs/inventory/view')
                            }, 400); return 'Successfully updated composition'
                        },
                        error: (err) => { console.log(err.message); return 'Error while updating composition' }
                    });
                } catch (err) {
                    console.log(result)
                }
        }
    }

    return <>
        <Container>
            <h1 className="title is-4">Add Composition</h1>
            <div className="columns">
                <div className="column is-12">
                    <form className="form" onSubmit={handleUpdateComposition}>
                        <div className="field">
                            <label className="label is-small">
                                Code
                            </label>
                            <div className="control">
                                <input className="input" defaultValue={data.code} name="code" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Name
                            </label>
                            <div className="control">
                                <input className="input" defaultValue={data.name} name="name" required />
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
                                            <th>Formula Quantity</th>
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
                                                                <input type="text" defaultValue={
                                                                    herb.herb_name
                                                                }
                                                                    disabled
                                                                    className="input"
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
                                Total Formula Quantity: {formulaQuantity}
                            </button>
                        </div>

                        <hr />
                        <div className="field">
                            <div className="control">
                                <button type="submit" className="button is-success">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </Container >
    </>

}

export async function getServerSideProps(context) {

    // select the composition to edit by id
    const result = await database.query(`
        SELECT * FROM compositions
        WHERE id = ${context.params.id}
    `);
    // get the list of herbs for that composition
    const herbs = await database.query(`
        SELECT * FROM composition_herbs
        WHERE composition_id = ${context.params.id}
    `);

    let data: any = {}
    data.id = result[0].id
    data.name = result[0].name
    data.code = result[0].code
    data.formulaQuantity = result[0].formula_quantity
    data.herbsList = herbs
    // convert to json
    console.log(data)
    data = JSON.parse(JSON.stringify(data))
    
    database.end()
    return {
        props: {
            data
        }
    }
}
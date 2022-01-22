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
    const [herbsList, setHerbsList] = useState([]);
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

    const handleCreateComposition = async (e: FormEvent) => {
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
            // push all the data to /api/invoice/add
            let isOkey = true;
            let herbname = '';
            herbsList.forEach((herb) => {
                if (!herb.id) {
                    // toast select the herb from dropdown
                    isOkey = false;
                    herbname = herb.name;
                }
            })
            if (isOkey) {
                var result
                try {
                    result = axios.post('/api/compositions/add', {
                        code,
                        name,
                        formulaQuantity,
                        herbsList
                    })
                    toast.promise(result, {
                        loading: 'Adding purchase...',
                        success: () => {
                            setTimeout(() => {
                                // router.push('/herbs/inventory/view')
                            }, 400); return 'Successfully added composition'
                        },
                        error: (err) => { console.log(err.message); return 'Error.. Make Sure Composition Code Is Unique' }
                    });
                } catch (err) {
                    console.log(result)
                }
            } else {
                toast.error(`Please select the herb ${herbname} from dropdown`);
            }

        }
    }

    return <>
        <Container>
            <h1 className="title is-4">Add Composition</h1>
            <div className="columns">
                <div className="column is-12">
                    <form className="form" onSubmit={handleCreateComposition}>
                        <div className="field">
                            <label className="label is-small">
                                Code
                            </label>
                            <div className="control">
                                <input className="input" name="code" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label is-small">
                                Name
                            </label>
                            <div className="control">
                                <input className="input" name="name" required />
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
                                                                <Autocomplete
                                                                    getItemValue={(item) => item.name}
                                                                    items={data}
                                                                    renderItem={(item, isHighlighted) =>
                                                                        <div style={{ background: isHighlighted ? 'lightgray' : 'white', padding: '0px 5px' }}>
                                                                            <span>{item.name}</span>
                                                                        </div>
                                                                    }
                                                                    shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                                                    renderInput={(props) =>
                                                                        <input
                                                                            {...props}
                                                                            className="input"
                                                                            placeholder="Herb Name"
                                                                            required
                                                                        />
                                                                    }
                                                                    menuStyle={{
                                                                        borderRadius: '3px',
                                                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                                        padding: '2px 0',
                                                                        position: 'fixed',
                                                                        zIndex: '2',
                                                                        overflow: 'auto',
                                                                        maxHeight: '200px', // TODO: don't cheat, let it flow to the bottom
                                                                    }}

                                                                    value={herb.name}
                                                                    onChange={(e, value) => {
                                                                        var newHerbsList = [...herbsList];
                                                                        newHerbsList[index].name = e.target.value;
                                                                        setHerbsList(newHerbsList);
                                                                    }}
                                                                    onSelect={(value, item) => {
                                                                        var newHerbsList = [...herbsList];
                                                                        newHerbsList[index].name = item.name;
                                                                        newHerbsList[index].id = item.id;
                                                                        setHerbsList(newHerbsList);
                                                                    }}
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
                                                        <button type="button" className="button is-small is-warning" onClick={() => {
                                                            setHerbsList(herbsList.filter((_, i) => i !== index))
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
                            <button type="button" className="button is-primary is-small" onClick={() => {
                                setHerbsList([...herbsList, {
                                    id: '',
                                    name: '',
                                    quantity: 0,
                                }])
                            }}>
                                <span className="icon">
                                    ➕
                                </span>
                                <span>Add New Herb</span>
                            </button>
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

export async function getServerSideProps() {

    const result: any = await database.query(`SELECT name, id FROM herbs`)
    // convert result to json
    const data = JSON.parse(JSON.stringify(result))
    database.end()
    return {
        props: {
            data
        }
    }
}
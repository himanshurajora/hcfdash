import { useEffect, useState } from "react";
import database from "../../lib/database"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
export default function ViewHerbs({ data }) {

    const [herbs, setHerbs] = useState(data)

    // function to handle deleting of a herb
    const handleHerbDelete = (id) => {
        if(confirm("Are You Sure You Want To Delete It")){
            try{
                const result = axios.post('/api/herbs/delete', { id })
                toast.promise(result, {
                    loading: 'Deleting herb...',
                    success: () => {
                        setHerbs(herbs.filter(herb => herb.id !== id))
                        return 'Successfully deleted herb'
                    },
                    error: (err) => { console.log(err.message); return 'Error.. Make Sure To The Name is Unique' }
                });
            }catch(err){
                console.log(err);
            }
        }else{
            toast.error('Cancelled, It might be a "Mistake" 👩🏻‍💻')
        }
    }

    return <>
        <div className="container notification">
            <h1 className="title is-4">List Of Herbs</h1>
            <table className="table is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Botanical Name</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Re-Order Level</th>
                        <th>Purchase Price</th>
                        <th>Selling Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        herbs.map(herb => {
                            return <tr key={herb.id}>
                                <td>{herb.name}
                                </td>
                                <td>{herb.botanical_name}
                                </td>
                                <td>{herb.unit}
                                </td>
                                <td>{herb.quantity}
                                </td>
                                <td>{herb.reorder_level}
                                </td>
                                <td>{herb.purchase_price}
                                </td>
                                <td>{herb.selling_price}
                                </td>
                                {/* action icons */}
                                <td>
                                    <div className="buttons has-addons">
                                        <Link href={`/herbs/${herb.id}`}>
                                            <p className="button is-small is-info">
                                                <span className="icon ico is-small">
                                                    📝
                                                </span>
                                            </p>
                                        </Link>
                                        <a onClick={() => { handleHerbDelete(herb.id) }} className="button is-small is-danger">
                                            <span className="icon ico is-small">
                                                🗑️
                                            </span>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <Toaster></Toaster>
    </>
}

export async function getServerSideProps() {

    const result: any = await database.query(`SELECT * FROM herbs`)
    // convert result to json
    const data = JSON.parse(JSON.stringify(result))
    return {
        props: {
            data
        }
    }
}
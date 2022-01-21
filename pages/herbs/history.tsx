import { useEffect, useState } from "react";
import database from "../../lib/database"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Container from "../../components/Container/Container";
import exportCSV from "../../lib/exportCSV";
import { useRouter } from "next/router";

// a react component to show history table for herbs
export default function HerbsHistory({ data }) {
    const [herbHistories, setHerbHistories] = useState(data)
    const [maxItems, setMaxItems] = useState(50)
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("None")
    const [sortType, setSortType] = useState("ASC")
    const [selectedHerbs, setSelectedHerbs] = useState([])
    const router = useRouter()
    const [search, setSearch] = useState<string>(router.query.search as string)

    const handleDeleteHerbHistory = async (id: number) => {
        if (confirm("Are you sure you want to delete this herb history?")) {
            try {
                const result = axios.post(`/api/herbs/history/delete`,
                    {
                        id
                    })
                toast.promise(result, {
                    loading: "Deleting herb history...",
                    success: () => {
                        setHerbHistories(herbHistories.filter(herbHistory => herbHistory.id !== id))
                        return "Herb history deleted successfully"
                    },
                    error: "Error deleting herb history"
                })
            }
            catch (err) {
                console.log(err)
                toast.error("Error deleting herb history")
            }
        } else {
            toast.error("Okey not removed, Mistakes are what make us human")
        }
    }
    return <>
        <Container>
            <div className="title">
                Herbs History
            </div>
            <div className="columns is-justify-content-space-between is-multiline">
                <div className="column is-12-tablet">
                    <div className="columns is-justify-content-space-between">
                        <div className="column">
                            <div className="select">
                                <select name="items" value={maxItems} onChange={(e) => { setMaxItems(parseInt(e.target.value)) }}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <button className="button is-success mx-3" onClick={(e) => {
                                if (confirm("Are You Sure You Want To Export It?")) {
                                    if (data.length) {
                                        exportCSV(e, data, Object.keys(data[0]), "Herbs_History.csv")
                                        // show toast
                                        toast.success("Successfully Exported To CSV")
                                    } else {
                                        toast.error("No Data To Export")
                                    }
                                }
                            }}>Export To CSV 🧾</button>
                            <button className="button is-danger mx-3" disabled={selectedHerbs.length === 0}
                                onClick={() => {
                                    // handleDeleteMultiple()
                                    setSelectedHerbs([])
                                }}
                            >
                                Delete Multiple
                            </button>
                            <Link href={"/herbs/view"}>
                                <button className="button is-warning">
                                    All Herbs
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className="column is-1-laptop is-12-tablet">
                    <div className="columns is-multiline">
                        <div className="column">
                            <div className="field has-addons">
                                <div className="control">
                                    <div className="select">
                                        <select name="sort" defaultValue={"None"} onChange={(e) => {
                                            setSort(e.target.value)
                                        }}>
                                            <option value="None">Sort By</option>
                                            <option value="Name">Name</option>
                                            <option value="Quantity">Quantity</option>
                                            <option value="CreatedAt">Created At</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                        <select name="sort" value={sortType} onChange={(e) => { setSortType(e.target.value); }}>
                                            <option value="ASC">Ascending</option>
                                            <option value="DESC">Descending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <input type="text" className="input" value={search} onChange={(e) => {
                                setSearch(e.target.value)
                            }} placeholder="Search" />
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="table-container">
                <table className="table is-hoverable is-narrow is-fullwidth">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>S.N.</th>
                            <th>Name</th>
                            <th>Affected Qty.</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            herbHistories.map((herb, index) => {
                                if (index < maxItems * page && index >= maxItems * (page - 1)) {
                                    return <tr key={herb.id}>
                                        <td>
                                            <input type="checkbox" className="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedHerbs([...selectedHerbs, herb.id])
                                                    } else {
                                                        setSelectedHerbs(selectedHerbs.filter(id => id !== herb.id))
                                                    }
                                                    console.log(selectedHerbs);
                                                }}
                                            />
                                        </td>
                                        <td>{index + 1}
                                        </td>
                                        <td>
                                            {/* Keep only stating 20 characters */}
                                            {herb.herb_name.length > 20 ? herb.herb_name.substring(0, 20) + "..." : herb.herb_name}
                                        </td>
                                        <td>{herb.quantity}
                                        </td>
                                        <td>{herb.message}
                                            {
                                                herb.purchase_id ? <Link href={`/herbs/invoice/${herb.purchase_id}`}>
                                                    <a className="mx-1">
                                                    View Invoice
                                                    </a>
                                                </Link> : null

                                            }
                                        </td>
                                        {/* action icons */}
                                        <td>
                                            <div className="buttons has-addons">
                                                <a onClick={() => {
                                                    handleDeleteHerbHistory(herb.id)
                                                }} className="button is-small is-danger">
                                                    <span className="icon ico is-small">
                                                        🗑️
                                                    </span>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
            {/* Pagination for items */}
            <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                <a className="pagination-previous" onClick={() => { setPage(page - 1) }}>Previous</a>
                <a className="pagination-next" onClick={() => { setPage(page + 1) }}>Next page</a>
                <ul className="pagination-list">
                    {
                        Array(Math.ceil(herbHistories.length / maxItems)).fill(0).map((_, index) => {
                            // if there are too many pages then we will show only the first 5 pages
                            if (index < 5) {
                                return <li key={index}>
                                    <a onClick={() => { setPage(index + 1) }} className={index + 1 === page ? "pagination-link is-current" : "pagination-link"} aria-label="Page 1" aria-current="page">
                                        {index + 1}
                                    </a>
                                </li>
                            }
                            // show the last 5 pages
                            else if (index >= herbHistories.length / maxItems - 5) {
                                return (
                                    <>
                                        <li key={index}>
                                            <a onClick={() => { setPage(index + 1) }} className={index + 1 === page ? "pagination-link is-current" : "pagination-link"} aria-label="Page 1" aria-current="page">
                                                {index + 1}
                                            </a>
                                        </li>
                                    </>
                                )
                            }

                            else if (index === 5) {
                                return <>
                                    <li><span className="pagination-ellipsis">&hellip;</span></li>
                                </>
                            }

                        })
                    }
                </ul>
            </nav>
        </Container>
    </>
}


// getServerSideProps is a function that gets called on every request to the page
// it is used to get data from the database and pass it to the page
export async function getServerSideProps() {
    // get the data from the database
    var data = await database.query(`select * from herbs_history`)
    // convert the data to json
    data = JSON.parse(JSON.stringify(data))
    // return the data to the page
    return {
        props: {
            data: data
        }
    }
}


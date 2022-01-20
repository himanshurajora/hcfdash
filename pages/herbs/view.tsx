import { useEffect, useState } from "react";
import database from "../../lib/database"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Container from "../../components/Container/Container";
import exportCSV from "../../lib/exportCSV";
import { useRouter } from "next/router";

export default function ViewHerbs({ data }) {

    const [herbs, setHerbs] = useState(data)
    const [maxItems, setMaxItems] = useState(50)
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("None")
    const [sortType, setSortType] = useState("ASC")
    const [selectedHerbs, setSelectedHerbs] = useState([])
    const router = useRouter()
    const [search, setSearch] = useState<string>(router.query.search as string)
    // on sort and sort type change useEffect
    useEffect(() => {
        handleSort(sort, sortType)
    }, [sort, sortType])

    // on search change useEffect
    useEffect(() => {
        if (search) {
            handleSearch()
        } else {
            setHerbs(data)
        }
    }, [search])

    // function to handle deleting of a herb
    const handleHerbDelete = (id) => {
        if (confirm("Are You Sure You Want To Delete It")) {
            try {
                const result = axios.post('/api/herbs/delete', { id })
                toast.promise(result, {
                    loading: 'Deleting herb...',
                    success: () => {
                        setHerbs(herbs.filter(herb => herb.id !== id))
                        return 'Successfully deleted herb'
                    },
                    error: (err) => { console.log(err.message); return 'Error.. Make Sure To The Name is Unique' }
                }, { duration: 1000 });
            } catch (err) {
                console.log(err);
            }
        } else {
            toast.error('Cancelled, It might be a "Mistake" 👩🏻‍💻')
        }
    }

    const handleDeleteMultiple = () => {
        // delete multiple herbs using the selectedHerbs array
        // and api /api/herbs/deletemultiple
        if (selectedHerbs.length > 0) {
            if (confirm("Are You Sure You Want To Delete Them")) {
                try {
                    const result = axios.post('/api/herbs/deletemultiple', { selectedHerbs })
                    toast.promise(result, {
                        loading: 'Deleting herbs...',
                        success: () => {
                            setHerbs(herbs.filter(herb => !selectedHerbs.includes(herb.id)))
                            return 'Successfully deleted herbs'
                        },
                        error: (err) => { console.log(err.message); return 'Error.. Make Sure To The Name is Unique' }
                    }, { duration: 1000 });
                } catch (err) {
                    console.log(err);
                }
            } else {
                toast.error('Cancelled, It might be a "Mistake" 👩🏻‍💻')
            }
        } else {
            toast.error('No herbs selected')
        }
    }

    // function to handle live search
    const handleSearch = () => {
        setHerbs(herbs.filter(herb => herb.name.toLowerCase().includes(search.toLowerCase())))
    }

    const handleSort = (sort_p, sortType_p) => {
        console.log(sort_p, sortType_p);
        switch (sort_p) {
            case "None":
                setHerbs(data)
                break;
            case "Name":
                if (sortType_p === "ASC") {
                    setHerbs([...herbs.sort((a, b) => a.name.localeCompare(b.name))])
                }
                else {
                    setHerbs([...herbs.sort((a, b) => b.name.localeCompare(a.name))])
                }
                toast.success("Sorted By " + sort + " By " + sortType)
                break;
            case "Quantity":
                if (sortType_p === "ASC") {
                    setHerbs([...herbs.sort((a, b) => a.quantity - b.quantity)])
                }
                else {
                    setHerbs([...herbs.sort((a, b) => b.quantity - a.quantity)])
                }
                toast.success("Sorted By " + sort + " By " + sortType)
                break;
            case "CreatedAt":
                if (sortType_p === "ASC") {
                    setHerbs([...herbs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())])
                }
                else {
                    setHerbs([...herbs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())])
                }
                toast.success("Sorted By " + sort + " By " + sortType)
            default:
                break;
        }
        // toast 
    }

    return <>
        <Container>
            <h1 className="title is-4">List Of Herbs</h1>
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
                                        exportCSV(e, data, Object.keys(data[0]), "Herbs.csv")
                                        // show toast
                                        toast.success("Successfully Exported To CSV")
                                    } else {
                                        toast.error("No Data To Export")
                                    }
                                }
                            }}>Export To CSV 🧾</button>
                            <button className="button is-danger" disabled={selectedHerbs.length === 0}
                                onClick={() => {
                                    handleDeleteMultiple()
                                    setSelectedHerbs([])
                                }}
                            >
                                Delete Multiple
                            </button>
                        </div>
                    </div>
                </div>
                <div className="column is-1-laptop is-12-tablet">
                    <div className="columns is-multiline">
                        <div className="column">
                            <div className="field has-addons">
                                {/* Sort By Name Or Quantity */}
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
                                {/* Acending Or Descending */}
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
                            {/* Set the search value to search parameter in query */}
                            <input type="text" className="input" value={search} onChange={(e) => {
                                setSearch(e.target.value)
                            }} placeholder="Search" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-container">
                <table className="table is-hoverable is-narrow is-fullwidth">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>S.N.</th>
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
                            herbs.map((herb, index) => {
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
                                            <Link href={`/herbs/${herb.id}?search=${search ? search : ""}`}>{herb.name.length > 20 ? herb.name.substring(0, 20) + "..." : herb.name}</Link>
                                        </td>
                                        <td>
                                            {/* Keep only stating 20 characters */}
                                            {herb.botanical_name.length > 20 ? herb.botanical_name.substring(0, 20) + "..." : herb.botanical_name}
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
                                                <Link href={`/herbs/${herb.id}?search=${search}`}>
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
                        Array(Math.ceil(herbs.length / maxItems)).fill(0).map((_, index) => {
                            // if there are too many pages then we will show only the first 5 pages
                            if (index < 5) {
                                return <li key={index}>
                                    <a onClick={() => { setPage(index + 1) }} className={index + 1 === page ? "pagination-link is-current" : "pagination-link"} aria-label="Page 1" aria-current="page">
                                        {index + 1}
                                    </a>
                                </li>
                            }
                            // show the last 5 pages
                            else if (index >= herbs.length / maxItems - 5) {
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
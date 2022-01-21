import { useEffect, useState } from "react";
import database from "../../../lib/database"
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Container from "../../../components/Container/Container";
import exportCSV from "../../../lib/exportCSV";
import { useRouter } from "next/router";

export default function ViewInvoices({ data }) {
    const [invoices, setInvoices] = useState(data)
    const [maxItems, setMaxItems] = useState(50)
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("None")
    const [sortType, setSortType] = useState("ASC")
    const [selectedHerbs, setSelectedHerbs] = useState([])
    const router = useRouter()
    const [search, setSearch] = useState<string>(router.query.search as string)
    // on sort and sort type change useEffect

    // function to delete the invoice
    const handleDeleteInvoice = async (purchase_id) => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            try {
                // send a post request to /api/invoice/delete
                // handle with toast
                const response = axios.post("/api/invoice/delete", { purchase_id })
                toast.promise(response, {
                    loading: "Deleting invoice...",
                    success: "Invoice deleted successfully",
                    error: "Error deleting invoice"
                })

                // update the invoices
                const updated_invoices = invoices.filter(invoice => invoice.id !== purchase_id)
                setInvoices(updated_invoices)
            }
            catch (err) {
                toast.error("Error deleting invoice")
            }
        } else {
            toast.error("Invoice not deleted")
        }
    }


    return <>
        <Container>
            <h1 className="title is-4">List Of Herbs</h1>
            <div className="columns is-justify-content-space-between is-multiline">
                <div className="column is-12-tablet">
                    <div className="columns is-justify-content-space-between">

                    </div>
                </div>
                <div className="column is-1-laptop is-12-tablet">
                    <div className="columns is-multiline">
                        <div className="column">
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
                                <div className="buttons">
                                    <button className="button is-success mx-3" onClick={(e) => {
                                        if (confirm("Are You Sure You Want To Export It?")) {
                                            if (data.length) {
                                                exportCSV(e, data, Object.keys(data[0]), "Invoices.csv")
                                                // show toast
                                                toast.success("Successfully Exported To CSV")
                                            } else {
                                                toast.error("No Data To Export")
                                            }
                                        }
                                    }}>Export To CSV 🧾</button>
                                    <div className="button is-primary">
                                        <Link href="/herbs/history">
                                            <p>
                                                Herbs History
                                            </p>
                                        </Link>
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
                            <th>S.N.</th>
                            <th>Date</th>
                            <th>Invoice No.</th>
                            <th>Remarks</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoices.map((invoice, index) => {
                                if (index < maxItems * page && index >= maxItems * (page - 1)) {
                                    return <tr key={invoice.id}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {
                                                // to indian format
                                                new Date(invoice.date * 1000).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })

                                            }
                                        </td>
                                        <td>
                                            {invoice.invoice_no}
                                        </td>
                                        <td>
                                            {/* Keep Only 20 Chracters */}
                                            {invoice.remarks.length > 20 ? `${invoice.remarks.substring(0, 20)}...` : invoice.remarks}
                                        </td>
                                        <td>
                                            {invoice.total_amount}
                                        </td>
                                        {/* action icons */}
                                        <td>
                                            <div className="buttons has-addons">
                                                <Link href={`/herbs/invoice/${invoice.id}`}>
                                                    <p className="button is-small is-info">
                                                        <span className="icon ico is-small">
                                                            📝
                                                        </span>
                                                    </p>
                                                </Link>
                                                <a onClick={() => {
                                                    handleDeleteInvoice(invoice.id)
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
                        Array(Math.ceil(invoices.length / maxItems)).fill(0).map((_, index) => {
                            // if there are too many pages then we will show only the first 5 pages
                            if (index < 5) {
                                return <li key={index}>
                                    <a onClick={() => { setPage(index + 1) }} className={index + 1 === page ? "pagination-link is-current" : "pagination-link"} aria-label="Page 1" aria-current="page">
                                        {index + 1}
                                    </a>
                                </li>
                            }
                            // show the last 5 pages
                            else if (index >= invoices.length / maxItems - 5) {
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

    const result: any = await database.query(`SELECT *, UNIX_TIMESTAMP(created_at) as date FROM purchases order by id desc`)
    // convert result to json
    const data = JSON.parse(JSON.stringify(result))
    database.end()
    return {
        props: {
            data
        }
    }
}
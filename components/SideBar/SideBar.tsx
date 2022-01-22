import Link from "next/link";
import { useState } from "react";

export default function SideBar() {
    const [herbs, setherbs] = useState(true);
    const [compositions, setcompositions] = useState(true);
    const [herbsin, setherbsin] = useState(true);
    const [compositionsin, setcompositionsin] = useState(true);
    return (
        <>
            <aside className="menu is-success">
                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li>
                        <Link href="/">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <p onClick={()=>{setherbs(!herbs)}}>
                            <Link href={'/herbs'}>➡️ Herbs</Link>
                        </p>
                        <ul hidden={herbs}>
                            <li>
                                <Link href={'/herbs/add'}>
                                    Add Herbs
                                </Link>
                            </li>
                            <li>
                                <Link href={'/herbs/view'}>
                                    View Herbs
                                </Link>
                            </li>
                        </ul>
                        <p onClick={
                            ()=>{setherbsin(!herbsin)}
                        }>
                        <Link href={'/herbs'}>➡️ Herbs Inventory</Link>
                        </p>
                        <ul hidden={herbsin}>
                            <li>
                                <Link href={'/herbs/inventory/add'}>
                                    Add Inventory
                                </Link>
                            </li>
                            <li>
                                <Link href={'/herbs/inventory/view'}>
                                    View Invoices
                                </Link>
                            </li>
                        </ul>
                        <p onClick={
                            ()=>{setcompositions(!compositions)}
                        }>
                        <Link href={'/herbs'}>➡️ Compositions</Link>
                        </p>
                        <ul hidden={compositions}>
                            <li>
                                <Link href={'/compositions/add'}>
                                    Add Composition
                                </Link>
                            </li>
                            <li>
                                <Link href={'/compositions/view'}>
                                    View Compositions
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>
        </>
    )
}
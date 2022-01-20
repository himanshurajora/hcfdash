import Link from "next/link";

export default function SideBar() {
    return (
        <>
            <aside className="menu">
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
                        <Link href={'/herbs'}>Herbs</Link>
                        <ul>
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
                        <Link href={'/herbs'}>Herbs Inventory</Link>
                        <ul>
                            <li>
                                <Link href={'/herbs/inventory/add'}>
                                    Add Inventory 
                                </Link>
                            </li>
                            <li>
                                <Link href={'/herbs/view'}>
                                    View Invoices
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>
        </>
    )
}
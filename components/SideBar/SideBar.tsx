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
                    </li>
                </ul>

            </aside>
        </>
    )
}
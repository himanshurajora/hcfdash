import Container from "../../components/Container/Container";
import database from "../../lib/database";
import Link from "next/link";
export default function Herbs({ data }) {
    console.log(data)
    return (
        <>
            <Container className='container notification my-2'>
                <div className="title">
                    Herbs Section
                </div>
                <div>
                    {/* Small Boxes Containing Numeric Info */}
                    <div className="columns">
                        <div className="column">
                            <div className="box">
                                <div className="title">
                                    Total Herbs :
                                    &nbsp; {data.count}
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="box">
                                <div className="title">
                                    Below Low Level :
                                    &nbsp;{data.reorder}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* A bunch of Links */}
                    <div className="columns">
                        <div className="column">
                            <Link href="/herbs/add">
                                <a className="button is-primary">
                                    Add Herb
                                </a>
                            </Link>
                        </div>
                        <div className="column">
                            <Link href="/herbs/history">
                                <a className="button is-primary">
                                    Herb History
                                </a>
                            </Link>
                        </div>
                        <div className="column">
                            <Link href="/herbs/view">
                                <a href="" className="button is-primary">
                                    List of Herbs
                                </a>
                            </Link>
                        </div>
                        <div className="column">
                            <Link href="/herbs/lowlevel">
                                <a href="" className="button is-primary">
                                    Below Low Level
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}


export async function getServerSideProps(context) {
    // count the number of herbs
    const count = await database.query(`select count(*) as count from herbs`)
    // total herbs below reorder level
    const total_below_reorder = await database.query(`select count(*) as count from herbs where quantity < reorder_level`)

    var data: any = {}
    data.count = count[0].count
    data.reorder = total_below_reorder[0].count
    return {
        props: {
            data
        }
    }
}

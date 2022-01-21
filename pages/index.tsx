import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import Container from '../components/Container/Container'
export default function Home() {

  return (
    <>
      <Container>
        <div className="title">
          DashBoard
        </div>
        <div className="title is-4">
          For Herbs
        </div>
        <div className="columns">
          <div className="column is-7">
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
        </div>
      </Container>
    </>
  )
}

import Head from 'next/head'
import NavBar from '../components/navbar';

export default function Home() {
  return (
    <div className="root">
      <Head>
        <title>Spaceflight Live</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar />
      </main>

      <style jsx>
        {`
          main {
            width: 100%;
          }
        `}
      </style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

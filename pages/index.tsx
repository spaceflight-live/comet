import Head from 'next/head';
import NavBar from '../components/navbar';
import Landing from '../components/landing/landing';

export default function Home() {
  return (
    <div className="root font-inter">
      <Head>
        <title>Spaceflight Live</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Landing />
        <NavBar />
      </main>

      <style jsx>{`
        main {
          width: 100%;
        }
      `}</style>

      <style jsx global>{`
        .text-gradient {
          background: -webkit-linear-gradient(30deg, #22c0d6, #89e3be);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

import Head from 'next/head';
import NavBar from '../components/navbar';
import Landing from '../components/landing/landing';

export default function Home() {
  return (
    <div className="root font-inter text-white">
      <Head>
        <title>Spaceflight Live</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="h-screen w-screen flex flex-col">
        <Landing />
        <NavBar />
      </div>
      {new Array(100).fill('space').map((a, i) => (
        <p className="text-black" key={i}>
          {a} - {i}
        </p>
      ))}
    </div>
  );
}

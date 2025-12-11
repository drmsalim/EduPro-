import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('Error'));
  }, []);

  return (
    <div>
      <Head>
        <title>SWC Platform</title>
        <meta name="description" content="SWC Platform - Full Stack Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to SWC Platform</h1>
        <p>A full-stack monorepo with NestJS, Next.js, and Prisma</p>
        
        <div>
          <h2>API Status: {apiStatus}</h2>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Tech Stack</h3>
          <ul>
            <li>🐦 NestJS for the API</li>
            <li>⚛️ Next.js for the web app</li>
            <li>🗄️ Prisma for database ORM</li>
            <li>📦 PNPM for package management</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;

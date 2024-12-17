import React, { useState } from 'react';

interface Listing {
  title: string;
  price: string;
  link: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/scrape');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result: Listing[] = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Airbnb Listings</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Title </th>
            <th>Price </th>
            <th>Link.</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  View Listing
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

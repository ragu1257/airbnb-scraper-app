import React, { useEffect, useState } from 'react';

interface Listing {
  title: string;
  price: string;
  link: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [url,] = useState<string>('https://www.airbnb.com/');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const result = await response.json();

      // Check if the response contains 'success' and 'data'
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('Failed to retrieve listings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchData();
  }, [url]); // Re-fetch data when the URL changes

  return (
    <div style={{ padding: '20px' }}>
      <h1>Airbnb Listings</h1>

      <div>
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Listings'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border={1} style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>Title</th>
            <th style={{ padding: '8px' }}>Price</th>
            <th style={{ padding: '8px' }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px' }}>{item.title}</td>
                <td style={{ padding: '8px' }}>{item.price}</td>
                <td style={{ padding: '8px' }}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    View Listing
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                No listings available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;

import { useState } from 'react';
import ListingTable from './components/ListingTable';
import useFetchListings from './hooks/useFetchListings';
import PaginationControls from './components/PaginationControls';

const App = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, loading, error, hasMore, fetchData } = useFetchListings('https://www.airbnb.com/');

  const handleNextPage = () => {
    if (hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchData(prevPage);
    }
  };

  const handleRefetch = () => {
    setCurrentPage(1);
    fetchData(1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Airbnb Listings</h1>

      <PaginationControls
        currentPage={currentPage}
        hasMore={hasMore}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        onRefetch={handleRefetch}
        loading={loading}
      />

      <ListingTable data={data} loading={loading} error={error} />
    </div>
  );
};

export default App;
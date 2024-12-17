import { useState, useEffect } from 'react';

interface Listing {
    title: string;
    price: string;
    link: string;
}

interface FetchResult {
    data: Listing[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    fetchData: (page: number) => void;
}

const useFetchListings = (url: string): FetchResult => {
    const [data, setData] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchData = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}&pageNumber=${page}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch data');
            }

            const listings = await response.json();

            if (listings.success && listings.data) {
                setHasMore(listings.data.length > page * 10);
                setData(listings.data.result);
            } else {
                throw new Error('Failed to retrieve listings');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    return { data, loading, error, hasMore, fetchData };
};

export default useFetchListings;
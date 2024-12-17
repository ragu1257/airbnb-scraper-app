
interface Listing {
    title: string;
    price: string;
    link: string;
}

interface ListingTableProps {
    data: Listing[];
    loading: boolean;
    error: string | null;
}

const ListingTable = ({ data, loading, error }: ListingTableProps) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <table border={1} style={{ marginTop: '20px', width: '100%' }}>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.title}</td>
                            <td>{item.price}</td>
                            <td>
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
    );
};

export default ListingTable;
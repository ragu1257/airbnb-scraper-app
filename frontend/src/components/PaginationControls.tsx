
interface PaginationControlsProps {
    currentPage: number;
    hasMore: boolean;
    onNext: () => void;
    onPrevious: () => void;
    onRefetch: () => void;
    loading: boolean;
}

const PaginationControls = ({
    currentPage,
    hasMore,
    onNext,
    onPrevious,
    onRefetch,
    loading
}: PaginationControlsProps) => {
    return (
        <div>
            <button onClick={onRefetch} disabled={loading}>
                Re-fetch Listings
            </button>
            <button onClick={onPrevious} disabled={loading || currentPage === 1}>
                Previous Page
            </button>
            <button onClick={onNext} disabled={loading || !hasMore}>
                Next Page
            </button>
        </div>
    );
};

export default PaginationControls;
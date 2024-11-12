interface SortingFilteringControlsProps<T extends string> {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOption: T;
    setSortOption: (value: T) => void;
    sortOptions: Array<{ value: T; label: string }>;
    placeholder: string;
}

const SortingFilteringControls = <T extends string>({
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    sortOptions,
    placeholder,
}: SortingFilteringControlsProps<T>): JSX.Element => (
    <div style={{
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#282828',
        padding: '10px 15px',
        borderRadius: '8px',
    }}>
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                flex: '1',
                backgroundColor: '#333',
                color: '#FFF',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '1rem',
                outline: 'none',
            }}
        />

        <label htmlFor="sort" style={{
            color: '#B3B3B3',
            fontSize: '0.9rem',
        }}>
            Sort by:
        </label>

        <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as T)}
            style={{
                backgroundColor: '#333',
                color: '#FFF',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '8px',
                width: '150px',
                fontSize: '1rem',
                outline: 'none',
            }}
        >
            {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export default SortingFilteringControls;

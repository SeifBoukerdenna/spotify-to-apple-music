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
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '1rem', flex: '1' }}
        />
        <label htmlFor="sort" style={{ marginRight: '0.5rem' }}>
            Sort by:
        </label>
        <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as T)}
            style={{ width: '150px' }}
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

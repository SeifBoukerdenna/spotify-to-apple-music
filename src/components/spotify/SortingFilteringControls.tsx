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
    <div className="mb-4 flex items-center gap-4 bg-gray-800 p-3 rounded-lg">
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-md p-2 text-base focus:outline-none"
        />

        <label htmlFor="sort" className="text-gray-400 text-sm font-medium">
            Sort by:
        </label>

        <div className="relative w-36">
            <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as T)}
                className="appearance-none bg-gray-700 text-white border border-gray-600 rounded-md p-2 pr-8 w-full text-base focus:outline-none"
            >
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
        </div>
    </div>
);

export default SortingFilteringControls;

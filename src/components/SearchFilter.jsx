function SearchFilter({ setSearchTerm, setStartDate, setEndDate }) {
  return (
    <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Search & Filter</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Company Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
            Search by Company
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <input
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50"
              placeholder="Enter company name..."
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex-1 flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              Start Date
            </label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              End Date
            </label>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;

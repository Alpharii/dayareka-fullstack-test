export default function ActionBar() {
    return (
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add New Customer
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Customer"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Place</button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Refresh</button>
        </div>
      </div>
    );
  }
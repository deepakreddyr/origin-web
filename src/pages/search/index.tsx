import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SearchItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  image?: string;
}

interface ApiResponse {
  items?: SearchItem[];
  data?: SearchItem[];
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get initial query from URL params
//   useEffect(() => {
//     if (router.isReady) {
//       const { query } = router.query;
//       if (query) {
//         setSearchQuery(query);
//         handleSearch(query);
//       }
//     }
//   }, [router.isReady]);

  const handleSearch = async (query: string): Promise<void> => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Using the second API endpoint with query parameter
      const headers = new Headers({
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'referer': 'http://localhost:3000/',
        'origin': 'http://localhost:3000',
        'content-type': 'application/json',
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'store-id': '4',
        'delivery-type': 'instant',
        'mm-build-version': '1.0.0',
        'authorization': `${localStorage.getItem("user_token")}`, 
        'mm-device-type': 'web',
        'host': 'api.webdev.madrasmandi.in'
      });

      // Add headers that might be restricted by browsers
      headers.set('sec-fetch-dest', 'empty');
      headers.set('sec-fetch-mode', 'cors');
      headers.set('sec-fetch-site', 'cross-site');
      headers.set('sec-ch-ua-mobile', '?0');
      headers.set('sec-ch-ua', '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"');
      headers.set('sec-ch-ua-platform', '"macOS"');
      headers.set('priority', 'u=1, i');

      const response = await fetch(`https://api.webdev.madrasmandi.in/api/v5/user/items?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      const results = data.items || data.data || (Array.isArray(data) ? data : []);
      setSearchResults(results);
      
      // Update URL without page reload
      router.push(`/search?query=${encodeURIComponent(query)}`, undefined, { shallow: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Debounced search (optional - searches as user types)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Items</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for items..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          {/* Results Header */}
          {!loading && !error && searchQuery && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-sm text-gray-600">
                {searchResults.length} item{searchResults.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {/* Results List */}
          {!loading && !error && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name || item.title || 'Item'}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {item.category}
                          </span>
                        )}
                        {item.price && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || item.title || 'Item'}
                        className="w-16 h-16 object-cover rounded-md ml-4"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No items found for "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords or check your spelling</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-600">Enter a search term to find items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
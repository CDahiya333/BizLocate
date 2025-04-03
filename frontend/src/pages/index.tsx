import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FaBuilding, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Business } from '../types/business';
import { getBusinesses } from '../services/api';
import BusinessCard from '../components/BusinessCard';
import { BusinessCardSkeleton } from '../components/LoadingSkeleton';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = [
    'All Categories',
    'Food & Dining',
    'Retail & Shopping',
    'Health & Medical',
    'Professional Services',
    'Home Services',
    'Education',
    'Technology',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const result = await getBusinesses(
          currentPage, 
          10, 
          searchTerm,
          selectedCategory === 'All Categories' ? '' : selectedCategory
        );
        setBusinesses(result.businesses);
        setFilteredBusinesses(result.businesses);
        setTotalPages(result.pages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
        setError('Failed to load businesses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage, searchTerm, selectedCategory]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <>
      <Head>
        <title>BizLocate - Find Local Businesses</title>
        <meta name="description" content="Discover and connect with local businesses in your area" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <FaBuilding className="inline-block mr-2" />
              BizLocate
            </h1>
            <p className="text-xl mb-6">Discover and connect with trusted local businesses</p>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
              <input 
                type="text" 
                placeholder="Search businesses..." 
                className="input input-bordered w-full pr-12 bg-white text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold">Featured Businesses</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <FaFilter /> 
                {selectedCategory || 'All Categories'}
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <li key={category}>
                    <a 
                      className={selectedCategory === category ? 'active' : ''}
                      onClick={() => setSelectedCategory(category === 'All Categories' ? '' : category)}
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {(searchTerm || selectedCategory) && (
              <button 
                className="btn btn-ghost btn-sm gap-1"
                onClick={clearFilters}
              >
                <FaTimes /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          {loading ? (
            <div className="space-y-6">
              {/* Show skeleton loaders while loading */}
              {[...Array(3)].map((_, index) => (
                <BusinessCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">No businesses found matching your criteria.</p>
              <button 
                className="btn btn-primary mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBusinesses.map(business => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBusinesses.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              {currentPage > 1 && (
                <button 
                  className="join-item btn" 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              )}
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i + 1}
                  className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              {currentPage < totalPages && (
                <button 
                  className="join-item btn" 
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaBuilding, FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminBusinessCard from '../../components/AdminBusinessCard';
import { Business } from '../../types/business';
import { getBusinesses, deleteBusiness } from '../../services/api';

export default function AdminDashboard() {
  const { admin } = useAuth();
  const router = useRouter();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const result = await getBusinesses(currentPage);
        setBusinesses(result.businesses);
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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleEdit = (business: Business) => {
    router.push(`/admin/business/edit/${business._id}`);
  };

  const handleDeleteConfirm = (businessId: string) => {
    setConfirmDelete(businessId);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      setLoading(true);
      await deleteBusiness(confirmDelete);
      
      // Refresh the business list
      const result = await getBusinesses(currentPage);
      setBusinesses(result.businesses);
      setTotalPages(result.pages);
      
      setConfirmDelete(null);
    } catch (err) {
      console.error('Failed to delete business:', err);
      setError('Failed to delete business. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const filteredBusinesses = searchTerm 
    ? businesses.filter(business => 
        business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : businesses;

  return (
    <ProtectedRoute>
      <Head>
        <title>Admin Dashboard | BizLocate</title>
        <meta name="description" content="Admin dashboard for BizLocate" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Administrator View</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Business Listings */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Listings</h2>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/admin/business/add')}
              >
                <FaPlus />
                Add Business
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search businesses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pr-12"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaSearch />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg">No businesses found.</p>
                <p className="mb-4">Add your first business listing to get started.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/admin/business/add')}
                >
                  <FaPlus className="mr-2" />
                  Add Business
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBusinesses.map(business => (
                  <AdminBusinessCard 
                    key={business._id} 
                    business={business} 
                    onEdit={handleEdit}
                    onDelete={handleDeleteConfirm}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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
          </div>

          {/* Right side - Admin information */}
          <div className="w-full md:w-1/4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Admin Profile</h2>
                {admin ? (
                  <div>
                    <p className="font-bold text-lg">{admin.name}</p>
                    <p className="text-gray-600">{admin.email}</p>
                  </div>
                ) : (
                  <p>Loading profile...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this business? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-ghost"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 
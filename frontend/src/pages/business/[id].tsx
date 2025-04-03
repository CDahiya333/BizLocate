import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { Business } from '../../types/business';
import { getBusiness } from '../../services/api';
import BusinessDetail from '../../components/BusinessDetail';
import { BusinessDetailSkeleton } from '../../components/LoadingSkeleton';

export default function BusinessPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getBusiness(id as string);
        setBusiness(data);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch business with id ${id}:`, err);
        setError('Failed to load business details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  return (
    <>
      <Head>
        <title>
          {business ? `${business.businessName} | BizLocate` : 'Business Details | BizLocate'}
        </title>
        <meta 
          name="description" 
          content={business?.description || 'View detailed information about this business.'} 
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="btn btn-ghost mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Businesses
        </Link>

        {loading ? (
          <BusinessDetailSkeleton />
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>{error}</span>
            </div>
          </div>
        ) : !business ? (
          <div className="alert alert-warning shadow-lg">
            <div>
              <span>Business not found. It may have been removed or is unavailable.</span>
            </div>
          </div>
        ) : (
          <BusinessDetail business={business} />
        )}
      </div>
    </>
  );
} 
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaInfo, FaCheck } from 'react-icons/fa';
import { Business } from '../types/business';
import { copyToClipboard } from '../utils/clipboard';
import GoogleMapComponent from './GoogleMap';
import { Skeleton } from './LoadingSkeleton';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  const [showMap, setShowMap] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyPhone = async () => {
    const success = await copyToClipboard(business.contactNumber);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side - Image with verified badge */}
          <div className="relative w-full md:w-1/3 max-w-[300px] mx-auto md:mx-0">
            <div className="rounded-lg overflow-hidden aspect-square relative">
              {/* Add image loading state */}
              <div className="absolute inset-0 z-0">
                <Skeleton className="w-full h-full" />
              </div>
              <Image 
                src={business.profileImage?.startsWith('/uploads') 
                  ? `http://localhost:5002${business.profileImage}` 
                  : '/default-business.jpg'} 
                alt={business.businessName}
                width={300}
                height={300}
                className="object-cover w-full h-full relative z-10"
                onLoad={(e) => {
                  // Once image is loaded, make it visible
                  (e.target as HTMLImageElement).style.opacity = '1';
                }}
                style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
              />
              {business.verified && (
                <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center text-xs font-bold">
                  <FaCheck className="text-success mr-1" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Business info and buttons */}
          <div className="w-full md:w-2/3">
            <h2 className="card-title text-2xl mb-2">{business.businessName}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{business.description}</p>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Call button */}
              <button 
                className="btn btn-circle btn-primary" 
                onClick={handleCopyPhone}
                title={`Call ${business.contactNumber}`}
              >
                <FaPhone />
              </button>
              {copySuccess && <span className="text-success text-xs">Copied!</span>}

              {/* Email button */}
              <a 
                href={`mailto:${business.email}`} 
                className="btn btn-circle btn-primary"
                title={`Email ${business.email}`}
              >
                <FaEnvelope />
              </a>

              {/* Website button */}
              {business.website && (
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-circle btn-primary"
                  title="Visit website"
                >
                  <FaGlobe />
                </a>
              )}

              {/* Map toggle button */}
              <button 
                className={`btn btn-circle ${showMap ? 'btn-success' : 'btn-primary'}`}
                onClick={() => setShowMap(!showMap)}
                title="Toggle map view"
              >
                <FaMapMarkerAlt />
              </button>

              {/* Details button */}
              <Link href={`/business/${business._id}`} className="btn btn-primary">
                <FaInfo className="mr-2" />
                Summary
              </Link>
            </div>

            {/* Map view */}
            {showMap && (
              <div className="w-full h-48 rounded-lg overflow-hidden shadow mb-2">
                {business.location.coordinates?.coordinates ? (
                  <GoogleMapComponent 
                    lat={business.location.coordinates.coordinates[1]} 
                    lng={business.location.coordinates.coordinates[0]}
                    businessName={business.businessName}
                    infoContent={
                      <div className="p-1">
                        <p className="font-semibold">{business.businessName}</p>
                        <p className="text-sm">{business.location.address}</p>
                        <p className="text-sm">{business.location.city}, {business.location.state}</p>
                      </div>
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 p-2">
                    <p className="text-center">
                      <FaMapMarkerAlt className="inline mr-2" />
                      No map coordinates available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard; 
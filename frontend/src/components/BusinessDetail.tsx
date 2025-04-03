import { useState } from 'react';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { Business } from '../types/business';
import { copyToClipboard } from '../utils/clipboard';
import GoogleMapComponent from './GoogleMap';
import { Skeleton } from './LoadingSkeleton';

interface BusinessDetailProps {
  business: Business;
}

const BusinessDetail = ({ business }: BusinessDetailProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyPhone = async () => {
    const success = await copyToClipboard(business.contactNumber);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Dummy reviews for the static review section
  const dummyReviews = [
    {
      id: 1,
      author: 'John Doe',
      rating: 5,
      comment: 'Amazing service! Highly recommended for quality and professionalism.',
      date: '2023-08-15'
    },
    {
      id: 2,
      author: 'Jane Smith',
      rating: 4,
      comment: 'Great experience overall. Very responsive team and excellent customer service.',
      date: '2023-07-22'
    },
    {
      id: 3,
      author: 'Michael Johnson',
      rating: 5,
      comment: "Best in town! I've been using their services for years and have never been disappointed.",
      date: '2023-06-10'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Image with verified badge */}
            <div className="w-full lg:w-1/3">
              <div className="relative rounded-lg overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <Skeleton className="w-full h-full" />
                </div>
                <Image 
                  src={business.profileImage?.startsWith('/uploads') 
                    ? `http://localhost:5002${business.profileImage}` 
                    : '/default-business.jpg'} 
                  alt={business.businessName}
                  width={500}
                  height={500}
                  className="object-cover w-full relative z-10"
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '1';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                />
                {business.verified && (
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center text-sm font-bold">
                    <FaCheck className="text-success mr-2" />
                    <span>Verified Business</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Business info */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{business.businessName}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{business.description}</p>
              
              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Category:</span>
                    <span>{business.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Address:</span>
                    <span>
                      {business.location.address}, {business.location.city}, {business.location.state}, {business.location.zipCode}, {business.location.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Call button */}
                <button 
                  className="btn btn-primary" 
                  onClick={handleCopyPhone}
                >
                  <FaPhone className="mr-2" />
                  {business.contactNumber}
                </button>
                {copySuccess && <span className="text-success text-sm">Copied to clipboard!</span>}

                {/* Email button */}
                <a 
                  href={`mailto:${business.email}`} 
                  className="btn btn-primary"
                >
                  <FaEnvelope className="mr-2" />
                  Email
                </a>

                {/* Website button */}
                {business.website && (
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    <FaGlobe className="mr-2" />
                    Website
                  </a>
                )}
              </div>

              {/* Social Media Links */}
              {business.socialMedia && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Connect With Us</h2>
                  <div className="flex gap-3">
                    {business.socialMedia.facebook && (
                      <a 
                        href={business.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-primary"
                      >
                        <FaFacebook />
                      </a>
                    )}
                    {business.socialMedia.twitter && (
                      <a 
                        href={business.socialMedia.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-primary"
                      >
                        <FaTwitter />
                      </a>
                    )}
                    {business.socialMedia.instagram && (
                      <a 
                        href={business.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-primary"
                      >
                        <FaInstagram />
                      </a>
                    )}
                    {business.socialMedia.linkedin && (
                      <a 
                        href={business.socialMedia.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-primary"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map View */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-3">Location</h2>
            <div className="w-full h-80 rounded-lg overflow-hidden shadow">
              {business.location.coordinates?.coordinates ? (
                <GoogleMapComponent 
                  lat={business.location.coordinates.coordinates[1]} 
                  lng={business.location.coordinates.coordinates[0]}
                  businessName={business.businessName}
                  zoom={15}
                  infoContent={
                    <div className="p-2">
                      <p className="font-semibold text-base">{business.businessName}</p>
                      <p className="text-sm">{business.location.address}</p>
                      <p className="text-sm">{business.location.city}, {business.location.state}</p>
                      <p className="text-sm">{business.location.zipCode}, {business.location.country}</p>
                    </div>
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 p-4">
                  <p className="text-center text-lg">
                    <FaMapMarkerAlt className="inline-block mr-2" />
                    No map coordinates available
                    <br />
                    Address: {business.location.address}, {business.location.city}, {business.location.state}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-3 bg-base-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Address</h3>
              <p>
                {business.location.address}, {business.location.city}, {business.location.state} {business.location.zipCode}, {business.location.country}
              </p>
              {business.location.coordinates?.coordinates && (
                <p className="mt-2 text-sm text-gray-500">
                  Coordinates: {business.location.coordinates.coordinates[1].toFixed(6)}, {business.location.coordinates.coordinates[0].toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-3">Customer Reviews</h2>
            <div className="space-y-4">
              {dummyReviews.map(review => (
                <div key={review.id} className="bg-base-200 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{review.author}</h3>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail; 
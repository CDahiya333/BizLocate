import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { getBusiness, updateBusiness } from '../../../../services/api';

export default function EditBusiness() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState('');
  const [verified, setVerified] = useState(false);
  
  // Location state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getBusiness(id as string);
        
        if (data) {
          // Set basic info
          setBusinessName(data.businessName);
          setDescription(data.description);
          setCategory(data.category);
          setContactNumber(data.contactNumber);
          setEmail(data.email);
          setWebsite(data.website || '');
          setCurrentImage(data.profileImage);
          setVerified(data.verified);
          
          // Set location info
          if (data.location) {
            setAddress(data.location.address);
            setCity(data.location.city);
            setState(data.location.state);
            setZipCode(data.location.zipCode);
            setCountry(data.location.country);
            
            if (data.location.coordinates) {
              const [lng, lat] = data.location.coordinates.coordinates;
              setLongitude(lng.toString());
              setLatitude(lat.toString());
            }
          }
        }
      } catch (err) {
        console.error(`Failed to fetch business with id ${id}:`, err);
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('contactNumber', contactNumber);
      formData.append('email', email);
      formData.append('verified', String(verified));
      
      if (website) {
        formData.append('website', website);
      }
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      // Location data - constructing a location object to match MongoDB schema
      const locationData = {
        address,
        city,
        state,
        zipCode,
        country,
        coordinates: {
          type: 'Point',
          coordinates: [
            parseFloat(longitude) || 0,
            parseFloat(latitude) || 0
          ]
        }
      };
      
      // Add the location as JSON
      formData.append('location', JSON.stringify(locationData));
      
      await updateBusiness(id as string, formData);
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      console.error('Failed to update business:', err);
      setError(err.response?.data?.error || 'Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfileImage(files[0]);
    }
  };

  const categories = [
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Edit Business | Admin | BizLocate</title>
        <meta name="description" content="Edit business details on BizLocate" />
      </Head>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            className="btn btn-ghost gap-2"
            onClick={() => router.push('/admin')}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Edit Business</h1>
        </div>

        {error && (
          <div className="alert alert-error mb-8">
            <p>{error}</p>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Business Name*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category*</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Description*</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24 w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email*</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Contact Number*</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Website</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Profile Image</span>
                    </label>
                    {currentImage && (
                      <div className="mb-3">
                        <p className="text-sm mb-2">Current image:</p>
                        <img 
                          src={currentImage.startsWith('/uploads') ? `http://localhost:5002${currentImage}` : '/default-business.jpg'} 
                          alt="Current profile" 
                          className="w-32 h-32 object-cover rounded-lg border" 
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="form-control md:col-span-2 mt-2">
                    <label className="cursor-pointer flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={verified}
                        onChange={(e) => setVerified(e.target.checked)}
                      />
                      <span className="label-text">Mark as Verified Business</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Location Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Address*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">City*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">State/Province*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Zip/Postal Code*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Country*</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Longitude</span>
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      className="input input-bordered w-full"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="0.000000"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Latitude</span>
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      className="input input-bordered w-full"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="0.000000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-4 border-t">
                <button
                  type="submit"
                  className="btn btn-primary min-w-32"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Business
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
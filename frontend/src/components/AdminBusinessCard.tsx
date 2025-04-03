import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Business } from '../types/business';

interface AdminBusinessCardProps {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (businessId: string) => void;
}

const AdminBusinessCard = ({ business, onEdit, onDelete }: AdminBusinessCardProps) => {
  return (
    <div className="card card-compact bg-base-100 shadow-md hover:shadow-lg transition-shadow mb-4">
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left - Image */}
          <div className="relative w-full sm:w-1/4 max-w-[200px] mx-auto sm:mx-0">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image 
                src={business.profileImage?.startsWith('/uploads') 
                  ? `http://localhost:5002${business.profileImage}` 
                  : '/default-business.jpg'} 
                alt={business.businessName}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right - Business Info and Buttons */}
          <div className="w-full sm:w-3/4">
            <h2 className="card-title text-lg">{business.businessName}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {business.description}
            </p>
            
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => onEdit(business)}
              >
                <FaEdit />
                Edit
              </button>
              <button 
                className="btn btn-sm btn-error" 
                onClick={() => onDelete(business._id)}
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinessCard; 
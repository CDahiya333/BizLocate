import mongoose from 'mongoose';
import locationSchema from './schemas/location.schema.js';
import socialMediaSchema from './schemas/socialMedia.schema.js';
import operatingHoursSchema from './schemas/operatingHours.schema.js';

const businessSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: 'default-business.jpg'
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  verified: {
    type: Boolean,
    default: false
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email'
    ],
    lowercase: true
  },
  location: locationSchema,
  category: {
    type: String,
    required: [true, 'Business category is required'],
    enum: [
      'Food & Dining',
      'Retail & Shopping',
      'Health & Medical',
      'Professional Services',
      'Home Services',
      'Education',
      'Technology',
      'Entertainment',
      'Other'
    ]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL'
    ]
  },
  socialMedia: socialMediaSchema,
  operatingHours: operatingHoursSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for geospatial queries
businessSchema.index({ 'location.coordinates': '2dsphere' });

const Business = mongoose.model('Business', businessSchema);

export default Business; 
import Business from '../models/business.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name (ESM doesn't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Public
export const getBusinesses = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Add filtering
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.verified) filter.verified = req.query.verified === 'true';
    
    // Execute query
    const businesses = await Business.find(filter)
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const count = await Business.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Public
export const getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new business
// @route   POST /api/businesses
// @access  Private
export const createBusiness = async (req, res) => {
  try {
    const businessData = req.body;
    
    // Parse location if it's a JSON string
    if (businessData.location && typeof businessData.location === 'string') {
      try {
        businessData.location = JSON.parse(businessData.location);
      } catch (err) {
        console.error('Failed to parse location JSON:', err);
        return res.status(400).json({
          success: false,
          error: 'Invalid location data format'
        });
      }
    }
    
    // If file was uploaded, add the file path to the business data
    if (req.file) {
      businessData.profileImage = `/uploads/businesses/${req.file.filename}`;
    }
    
    const business = await Business.create(businessData);
    
    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Server Error in createBusiness:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
export const updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    const businessData = req.body;
    
    // Parse location if it's a JSON string
    if (businessData.location && typeof businessData.location === 'string') {
      try {
        businessData.location = JSON.parse(businessData.location);
      } catch (err) {
        console.error('Failed to parse location JSON:', err);
        return res.status(400).json({
          success: false,
          error: 'Invalid location data format'
        });
      }
    }
    
    // If file was uploaded, add the file path to the business data
    if (req.file) {
      // If there's an existing profile image, delete it
      if (business.profileImage && business.profileImage !== 'default-business.jpg') {
        const oldImagePath = path.join(__dirname, '..', business.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      businessData.profileImage = `/uploads/businesses/${req.file.filename}`;
    }
    
    business = await Business.findByIdAndUpdate(req.params.id, businessData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Server Error in updateBusiness:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private
export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }
    
    // Delete the profile image if it exists and isn't the default
    if (business.profileImage && business.profileImage !== 'default-business.jpg') {
      const imagePath = path.join(__dirname, '..', business.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await business.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get businesses near a location
// @route   GET /api/businesses/near
// @access  Public
export const getNearbyBusinesses = async (req, res) => {
  try {
    const { lng, lat, distance = 10 } = req.query; // distance in km
    
    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude coordinates'
      });
    }
    
    // Calculate radius using radians
    // Earth's radius is approximately 6378 kilometers
    const radius = distance / 6378;
    
    const businesses = await Business.find({
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 
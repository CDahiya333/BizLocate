import mongoose from 'mongoose';

const socialMediaSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  twitter: String,
  linkedin: String
}, { _id: false });

export default socialMediaSchema; 
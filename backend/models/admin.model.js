import mongoose from 'mongoose';
import adminSchema from './schemas/admin.schema.js';

const Admin = mongoose.model('Admin', adminSchema);

export default Admin; 
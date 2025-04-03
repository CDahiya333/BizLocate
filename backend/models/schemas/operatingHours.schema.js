import mongoose from 'mongoose';

const hourSet = {
  open: String,
  close: String
};

const operatingHoursSchema = new mongoose.Schema({
  monday: hourSet,
  tuesday: hourSet,
  wednesday: hourSet,
  thursday: hourSet,
  friday: hourSet,
  saturday: hourSet,
  sunday: hourSet
}, { _id: false });

export default operatingHoursSchema; 
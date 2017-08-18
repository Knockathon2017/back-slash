import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    verificationCode: {
        type: String,
        required: [true, 'Verification code is required.']
    },
    status: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }

}, { collections: 'User' });
//userSchema.index({ email: 1, verificationCode: 1, status: 1 }, { unique: true });
export default mongoose.model('User', userSchema);


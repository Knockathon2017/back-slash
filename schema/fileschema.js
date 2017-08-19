import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String
    },
    thumbnail: {
        type: String
    },
    orignalFile: {
        type: String
    },
    mimeType: {
        type: String
    },
    category: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    area: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: Number
    },
    description: {
        type: String
    },
    tags: {
        type: String
    },
    alarm: {
        type: String
    },
    time: {
        type: Number
    },
    metadata: {
        type: String,
        default: ""
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }

}, { collections: 'FileInfo' });
export default mongoose.model('FileInfo', fileSchema);


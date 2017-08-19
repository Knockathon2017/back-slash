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
        type: String
    },
    longitude: {
        type: String
    },
    locality: {
        type: String
    },
    address: {
        type: String
    },
    postalCode: {
        type: String
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
    status: {
        type: String,
        default: "inprogress"
    },
    comMode: {
        type: String
    },
    gMetadata: {
        type: Object
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


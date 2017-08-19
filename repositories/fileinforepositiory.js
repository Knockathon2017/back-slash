'use strict';
import FileInfoModel from '../schema/fileschema';

class FileInfoRepository {

	constructor(logger) {
		this.Logger = logger;
	}

	insertFileInfo(document) {
		return FileInfoModel.insertMany(document).then(data => {
			this.Logger.info('file info inserted successfully', { data });
			return data;
		});
    }
	
	updateFileInfo(condition, data) {
		return FileInfoModel.update(condition, data, { multi: true }).then(data => {
			this.Logger.info('file info updated successfully', { data });
			return data;
		});
    }

	getFileInfo(query) {
		return FileInfoModel.find(query).then(data => {
			this.Logger.info('File info fetched successfully', { data });
			return data;
		});
    }
}

export default FileInfoRepository;

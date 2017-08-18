import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';
import FileInfoModel from '../schema/fileschema';
import FileInfoRepository from '../repositories/fileinforepositiory';


class FileUploadService {

    constructor(loggerInstance, fileRepo) {
        this.logger = loggerInstance;
        this.fileRepoObj = fileRepo || new FileInfoRepository(this.logger);
    }

    insertFileInfo(requestData){
        return new Promise((resolve, reject) => {
            if (Util.isNullorEmpty(requestData.fileName)) {
                this.logger.warn(Constants.messages.FileNameNotEmpty);
                return resolve({
                    statusCode: 400,
                    data: { error: Constants.messages.FileNameNotEmpty }
                });
            }

            this.logger.info('preparing db model for file info insert');
            const fileInfoObj = new FileInfoModel();
            fileInfoObj.fileName = requestData.fileName;
            fileInfoObj.mimeType = requestData.mimeType;
            fileInfoObj.category = requestData.category;
            if (fileInfoObj.validateSync()) {
                this.logger.warn(Constants.messages.FileNameNotEmpty);
                return resolve({
                    statusCode: 400,
                    data: { error: Constants.messages.FileNameNotEmpty }
                });
            }
            this.fileRepoObj.insertFileInfo(fileInfoObj).then((data) => resolve(
                {
                    statusCode: 201,
                    data: data
                })).catch((error) => {
                return reject(error);
            });
        });
    }

    getFileInfo(obj) {
        let queryData = {};
        let queryArray = [];
        for(let item in obj){
            if(obj[item] && obj[item] != ""){
                let temp = {};
                temp[item] = obj[item];
                queryArray.push(temp);
                //queryData[item]=obj[item];
            }
        }
        if(queryArray.length > 1){
            queryData["$and"] = queryArray;
        }else if(queryArray.length == 1){
            queryData = queryArray[0];
        }
        return this.fileRepoObj.getFileInfo(queryData).then((data) => {
                return {
                    statusCode: 200,
                    data: data
                };
            });
    }

}

export default FileUploadService;
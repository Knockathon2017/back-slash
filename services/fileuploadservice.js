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
            /*if (Util.isNullorEmpty(requestData.fileName)) {
                this.logger.warn(Constants.messages.FileNameNotEmpty);
                return resolve({
                    statusCode: 400,
                    data: { error: Constants.messages.FileNameNotEmpty }
                });
            }*/

            this.logger.info('preparing db model for file info insert');
            const fileInfoObj = new FileInfoModel();
            const fileName = (requestData.fileName && requestData.fileName != "")? requestData.fileName:"";
            fileInfoObj.fileName = fileName;
            fileInfoObj.mimeType = (requestData.mimeType && requestData.mimeType != "")?requestData.mimeType:"";
            fileInfoObj.category = requestData.category;
            fileInfoObj.description = requestData.description;
            fileInfoObj.tags = requestData.tags;
            fileInfoObj.alarm = requestData.alarm;
            fileInfoObj.time = requestData.time;
            fileInfoObj.thumbnail = (fileName)?"http://www.makeathumbnail.com/thumbnails/image590053.jpg":"";
            fileInfoObj.orignalFile = (fileName)?`${global.settings.SERVICENAME}getFile/${fileName}`:"";
            fileInfoObj.comMode = (requestData.comMode)?requestData.comMode:"";
            fileInfoObj.gMetadata = requestData.gMetadata;
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

    updateFileInfo(data, status){
        return new Promise((resolve, reject) => {
            this.logger.info('updating file info');
            this.fileRepoObj.updateFileInfo({_id: data.id}, {status: status}).then((data) => resolve(
                {
                    statusCode: 200,
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
            if(obj[item]){
                let temp = {};
                if(item == "category"){
                    if(obj[item] == "custom"){
                        const temp2 = {};
                        temp2[item] = {$ne : ""};
                        queryArray.push(temp2);
                        temp[item] = {$ne : "grievances"};
                    }else if(obj[item] == "uc"){
                        temp[item] = "";
                    }else{
                        temp[item] = obj[item];
                    }
                    queryArray.push(temp);
                }else if(obj[item] != ""){
                    temp[item] = obj[item];
                    queryArray.push(temp);
                }
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
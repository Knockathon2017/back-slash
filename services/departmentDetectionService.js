import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';
import fs from 'fs';

const unirest = require('unirest');


class DepartmentService {

    constructor(loggerInstance) {
        this.logger = loggerInstance;
    }


    detectDepartment(fileName){
        this.logger.info(`Detect department for ${fileName}`);
        const filePath = `${global.appRoot}/file_uploaded/${fileName}`;
        this.logger.info(`File path is ${filePath}`);
        return new Promise((resolve, reject)=>{
            unirest.post(`http://cl-api.vize.ai/${global.settings.TASKID}`)
            .header("Authorization", `JWT ${global.settings.JWT}`)
            .attach("image", fs.createReadStream(filePath.trim()))
            .end(function (result) {
                if(result.status == 200){
                    return resolve({status: result.status, data: result.body});
                }
                return reject({status: result.status, data: result.body});
            });
        });
    }
}

export default DepartmentService;
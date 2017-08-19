import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';

import DepartmentDetectionService from '../services/departmentDetectionService';
import TwitterServices from '../services/twitterservices';
const twitterservice = new TwitterServices();

const getDepartment = (dep)=>{
    switch(dep){
        case "road":
            return Constants.DEPARTMENTS.ROAD;
        break;
        case "garbage":
            return Constants.DEPARTMENTS.GARBAGE;
        break;
        case "power":
            return Constants.DEPARTMENTS.POWER;
        break;
        case "railway":
            return Constants.DEPARTMENTS.RAIL;
        break;
    }
}

class JobManagerService {

    constructor(loggerInstance) {
        this.logger = loggerInstance;
    }

    triggerJob(data){
        this.logger.info(`Get a job to perform`)
        const fileName = data.fileName;
        const category = data.category;
        const isMedia = (fileName && fileName !="")?true:false;

        return new Promise((resolve, reject)=>{
            if(isMedia && category == Constants.ENUMS.GC){
                const obj = new DepartmentDetectionService(this.logger);
                obj.detectDepartment(fileName).then((response)=>{
                    if(response.data.prediction){
                        this.logger.info(`Tweet our grvience image`);
                        twitterservice.tweet(getDepartment(response.data.prediction),data.description,`${global.appRoot}/file_uploaded/${fileName}`).then((response) => {
                            return resolve({status:200,data:data});
                        }).catch((error) => {
                            return reject({status: 400, message: "Error in tweet", error:error});
                        });
                    }
                }).catch((error) => {
                    return reject(error);
                });
            } else if(!isMedia && category == Constants.ENUMS.GC){
                this.logger.info(`Tweet our grvience image`);
                twitterservice.tweet(getDepartment("road"),data.description).then((response) => {
                    return resolve({status:200,data:data});
                }).catch((error) => {
                    return reject({status: 400, message: "Error in tweet", error:error});
                });
            }
        });
    }
    
}

export default JobManagerService;
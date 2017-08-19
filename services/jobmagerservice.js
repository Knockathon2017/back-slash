import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';

import DepartmentDetectionService from '../services/departmentDetectionService';



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
                    if(response.prediction){
                        
                        return resolve(response);
                    }
                    return reject({status: 400, message:"Some error"});
                }).catch((error) => {
                    return reject(error);
                });
            }
        });
    }
    
}

export default JobManagerService;
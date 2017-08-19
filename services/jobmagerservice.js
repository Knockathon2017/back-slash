import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';

import DepartmentDetectionService from '../services/departmentDetectionService';



class JobManagerService {

    constructor(loggerInstance) {
        this.logger = loggerInstance;
    }

    triggerJob(){
        return new Promise((resolve, reject)=>{
            new DepartmentDetectionService(req.log).detectDepartment(result.data[0].fileName);
        });
    }
    
}

export default JobManagerService;
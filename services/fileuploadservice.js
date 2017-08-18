import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';


class FileUploadService {

    constructor(loggerInstance) {
        this.logger = loggerInstance;
    }

    uploadFile(){
        
    }

    getUsers(email) {
        const query = { email: email };
        return this.userRepoObj.getUsers(query).then((data) => {
                return {
                    statusCode: 200,
                    data: data
                };
            });
    }

}

export default FileUploadService;
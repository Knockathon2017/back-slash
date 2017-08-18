import Promise from 'bluebird';
import Constants from '../utils/constants';
import UserModel from '../schema/userschema';
import UserRepository from '../repositories/userrepository';
import Util from '../utils/helper';


class RegisterService {

    constructor(loggerInstance, userRepo) {
        this.logger = loggerInstance;
        this.userRepoObj = userRepo || new UserRepository(this.logger);
    }

    
    registerUser(requestData, loggedInUser) {
        const email = Util.trim(requestData.email);
        return new Promise((resolve, reject) => {
            if (Util.isNullorEmpty(email)) {
                this.logger.warn(Constants.messages.EmailNotEmpty);
                return resolve({
                    statusCode: 400,
                    data: { error: Constants.messages.EmailNotEmpty }
                });
            }

            this.logger.info('preparing db model for file index');
            const userObj = new UserModel();
            userObj.email = email;
            userObj.verificationCode = "123";
            if (userObj.validateSync()) {
                this.logger.warn(Constants.messages.EmailNotValid);
                return resolve({
                    statusCode: 400,
                    data: { error: Constants.messages.EmailNotValid }
                });
            }
            this.userRepoObj.createUser(userObj).then((data) => resolve(
                {
                    statusCode: 201,
                    data: data
                })).catch((error) => {
                return reject(error);
            });
        });
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

export default RegisterService;
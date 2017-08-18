'use strict';
import UserModel from '../schema/userschema';

/** @class UserRepository
 * @description CRUD operation with DB
*/
class UserRepository {

	constructor(logger) {
		this.Logger = logger;
	}

	createUser(document) {
		return UserModel.insertMany(document).then(data => {
			this.Logger.info('User created successfully', { data });
			return data;
		});
    }
    
	getUsers(query) {
		return UserModel.find(query).then(data => {
			this.Logger.info('Users fetched successfully', { data });
			return data;
		});
    }
}

export default UserRepository;

'use strict';
import Constants from './constants';

class FormatResponse {

    static formatResponse(statusCode, finalResult, customMessage, endPointName) {
        let returnMsg;
        switch (endPointName) {
            case Constants.ENDPOINTS.StoreIndexes:
                {
                    switch (statusCode) {
                        default:
                            returnMsg = this.getCommonMessages(statusCode);
                            break;
                    }
                }
                break;
            default:
                returnMsg = this.getCommonMessages(statusCode);
                break;

        }
        return {
            status: statusCode,
            message: returnMsg,
            result: finalResult
        };
    }

    static getCommonMessages(statusCode) {
        let returnMsg = '';
        switch (statusCode) {
            case 201:
                returnMsg = 'Data record created.';
                break;
            case 200:
                returnMsg = 'Response received successfully.';
                break;
            case 400:
                returnMsg = 'The request could not be understood by the server due to malformed syntax.';
                break;
            case 401:
                returnMsg = 'Unauthorized access.';
                break;
            case 403:
                returnMsg = 'The server understood the request, but is refusing to fulfill it.';
                break;
            case 409:
                returnMsg = 'Matching request already processed.';
            break;
            case 404:
                returnMsg = 'The server has not found anything matching the Request-URI.';
                break;
            case 500:
                returnMsg = 'The server encountered an unexpected condition which prevented it from fulfilling the request.';
                break;
            default:
                returnMsg = '';
                break;
        }
        return returnMsg;
    }

}

export default FormatResponse;

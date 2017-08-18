'use strict';
import _ from 'lodash';

class Helper {
    /**
        * @method isNullorEmpty
        * @description Verify an object is null or empty
        * @param {object} ownerInfo  File uploader info object.
        * @returns {boolean}.
        */
    static isNullorEmpty(val) {
        return (typeof val === 'number') ? _.isNil(val) : _.isEmpty(val);
    }

    /**
      * @method trim
      * @description Trim a string.
      * @param {string} value.
      * @returns {string} Returns a trimmed value.
      */
    static trim(value) {
        return _.trim(value);
    }

    /**
      * @method getUtcDateInEpochFormat
      * @description Returns current utc time in epoch.
      * @returns {number} Returns epoch number.
      */
    static getUtcDateInEpochFormat() {
        const timeInSeconds = (new Date(new Date().toUTCString()).getTime()) / 1000;
        const timeInSecondsInt = timeInSeconds >= 0 ?
            Math.floor(timeInSeconds) : Math.ceil(timeInSeconds);
        return timeInSecondsInt;
    }

    /**
        * @method logAndSendErrorResponse
        * @description Log request object, error and sends error response to client.
        * @param {object} request  httprequest object.
        * @param {object} response  httpresponse object.
        * @param {error} error  Error object.
        * @param {string} endPointName  end point name.
        * @returns {object} Returns httpresponse.
        */
    static logAndSendErrorResponse(request, response, errorDetail, endPointName) {
        try {
            const statusCode = (errorDetail && errorDetail.statusCode) ? errorDetail.statusCode : 500;
            request.log.error('Unexpected error occurred in server.', { errorData: errorDetail });
            const finalResponse = response.formatResult(statusCode,
            { error: errorDetail.error ? errorDetail.error : errorDetail.message }, endPointName);
            return response.status(statusCode).json(finalResponse);
        } catch (logError) {
            request.log.error('Unexpected error occurred in server.', { errorData: logError });
            const finalResponse = response.formatResult(500, {}, endPointName);
            return response.status(finalResponse.status).json(finalResponse);
        }
    }

}

export default Helper;

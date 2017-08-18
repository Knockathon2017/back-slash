import Util from '../utils/helper';
import Constants from '../utils/constants';

import emailService from '../services/emailservice';
import RegisterService from '../services/registerservice';
import { witservice } from './serverboot';

const fs = require('fs');
const path = require('path');
const mime = require('mime');

module.exports.registerUser = (request, response) => {
    try {
        const data = request.body;
        request.log.info(`request for registration of ${data.email}`);
        const endPointName = Constants.ENDPOINTS.REGISTER;
        const registerService = new RegisterService(request.log);
        registerService.registerUser(data)
            .then((result) => {
                const finalResponse = response.formatResult(result.statusCode,
                    result.data, endPointName);
                request.log.info('record fetched successfully');
                emailService.sendMail({
                    subject: "Activation code",
                    to: "eshu@yopmail.com",
                    html: "Hello <b>User</b><\br>Your activation code is <b>123</b>. Please enter this code in your App.<\br><\br>Thank you for choosing us."
                });
                return response.status(finalResponse.status).json(finalResponse);
            }).catch((err) => Util.logAndSendErrorResponse(request, response, err, endPointName));
    } catch (error) {
        return Util.logAndSendErrorResponse(request, response, error, endPointName);
    }
};

module.exports.uploadFile = (req, res) => {
    const files = req.files;
    if(files && files.length > 0){
        console.log("-----------------------eshu------------------");
        console.log(req.body.attributes)
        req.log.info('File uploaded');
        return res.status(200).json({data: "File uploaded"});
    }
}

module.exports.getFile = (req, res) => {
    var file = `${global.appRoot}/file_uploaded/${req.params.fileName}.${req.params.filextn}`;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);

    //res.download(file, "xyz.jpg"); // Set disposition and send it.
}


module.exports.wit = (req, res) => {
    const data = req.body;
    const message = data.message;
    witservice.context(message)
    .then(d => {
      console.log(d)
    }).catch(e => {
      console.error(e);
    })
}

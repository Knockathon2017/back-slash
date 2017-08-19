import Util from '../utils/helper';
import Constants from '../utils/constants';

import emailService from '../services/emailservice';
import RegisterService from '../services/registerservice';

import { witservice, twitterservice, imageresize } from './serverboot';

import FileUploadService from '../services/fileuploadservice';

import DepartmentDetectionService from '../services/departmentDetectionService';
import JobManager from '../services/jobmagerservice';

const fs = require('fs');
const path = require('path');
const mime = require('mime');

const getCategory = (category) => {
    switch(category){
        case Constants.ENUMS.GC:
         return Constants.ENUMS.GC;
        break;
        case Constants.ENUMS.C:
         return "custom";
        break;
        case Constants.ENUMS.UC:
         return "uc";
        break;
        default:
            return category;
        break;
    }
}

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

module.exports.gText = (req, res) => {
    req.log.info(`Get text data.`);
    const data = req.body;
    if(data.type == "qrcode"){
        data.comMode = "qrcode";
        data.category = Constants.ENUMS.GC;
        data.gMetadata = (data.metadata)?JSON.parse(data.metadata):{};
        //data.gMetadata = data.metadata;
        data.description = `Consern person item id ${data.gMetadata.id} have some issue.`;
    }else if(data.category == Constants.ENUMS.GC){
        data.comMode = "tweet"
    }


    const endPointName = Constants.ENDPOINTS.TEXT_UPLOAD;
    const fileUploadService = new FileUploadService(req.log);
    fileUploadService.insertFileInfo({
        category:(data.category && data.category != '')?data.category:"",
        description: (data.description && data.description != '')?data.description:"",
        tags: (data.tags && data.tags != '')?data.tags:"",
        alarm: (data.alarm && data.alarm != '')?data.alarm:"",
        time: (data.time && data.time != '')?data.time:"",
        address: (data.address && data.address != '')?data.address:"",
        latitude: data.gMetadata.latitude,
        longitude: data.gMetadata.longitude,
        locality: (data.locality && data.locality != '')?data.locality:"",
        postalCode: (data.postalCode && data.postalCode != '')?data.postalCode:"",
        comMode: (data.comMode && data.comMode != "")?data.comMode : "",
        gMetadata: data.gMetadata
    }).then((result) => {
        const jObj = new JobManager(req.log, emailService);
        jObj.triggerJob(result.data[0]).then((response)=>{
            fileUploadService.updateFileInfo(response.data,"tweeted").then((response)=>{
                req.log.info("File info is updated.");
            }).catch((error)=>{
                req.log.error("~~~~~~~~~~~~~~~~~error in updatetion of file info~~~~~~~~~~~~~~~~~~",{error});
            })
        }).catch((error) => {
            req.log.error("~~~~~~~~~~~~~~~~~error in job triggering~~~~~~~~~~~~~~~~~~", {error});
        })
        req.log.info('Text data inserted');
        const finalResponse = res.formatResult(result.statusCode,
            result.data, endPointName);
        req.log.info('record inserted successfully');
        return res.status(finalResponse.status).json(finalResponse);
    }).catch((err) => Util.logAndSendErrorResponse(req, res, err, endPointName));
}

module.exports.uploadFile = (req, res) => {
    const files = req.files;
    if(files && files.length > 0){
        const endPointName = Constants.ENDPOINTS.UPLOADFILE;

        imageresize.resize(`${global.appRoot}/file_uploaded/${files[0].originalname}`, `${global.appRoot}/thumb_images/${files[0].originalname}`, 100, 100)
        .then(data => {
            console.log("Thumb nail created for image "+files[0].originalname);
        }).catch(err => {
                console.log("error in generating thumb for "+files[0].originalname);
        })

        imageresize.resize(`${global.appRoot}/file_uploaded/${files[0].originalname}`, `${global.appRoot}/detect_images/${files[0].originalname}`, 400, 400)
        .then(data => {
            console.log("detection image created for image "+files[0].originalname);
        }).catch(err => {
                console.log("detection image error for image "+files[0].originalname);
        })

        const fileUploadService = new FileUploadService(req.log);
        const category = getCategory((req.body.category && req.body.category != '')?req.body.category:"");
        fileUploadService.insertFileInfo({
            fileName: files[0].originalname, mimeType: files[0].mimetype,
            category: category,
            description: (req.body.description && req.body.description != '')?req.body.description:"",
            tags: (req.body.tags && req.body.tags != '')?req.body.tags:"",
            alarm: (req.body.alarm && req.body.alarm != '')?req.body.alarm:"",
            time: (req.body.time && req.body.time != '')?req.body.time:"",
            address: (req.body.address && req.body.address != '')?req.body.address:"",
            latitude: (req.body.latitude && req.body.latitude != '')?req.body.latitude:"",
            longitude: (req.body.longitude && req.body.longitude != '')?req.body.longitude:"",
            locality: (req.body.locality && req.body.locality != '')?req.body.locality:"",
            postalCode: (req.body.postalCode && req.body.postalCode != '')?req.body.postalCode:""
        })
            .then((result) => {
                const jObj = new JobManager(req.log);
                jObj.triggerJob(result.data[0]).then((response)=>{
                    console.log("~~~~~~~~~~~~~~~~~eshu 1~~~~~~~~~~~~~~~~~~");
                    fileUploadService.updateFileInfo(response.data,"tweeted").then((response)=>{
                        req.log.info("File info is updated.");
                    }).catach((error)=>{
                        req.log.error("~~~~~~~~~~~~~~~~~error in updatetion of file info~~~~~~~~~~~~~~~~~~",{error});
                    })
                }).catch((error) => {
                    req.log.error("~~~~~~~~~~~~~~~~~error in job triggering~~~~~~~~~~~~~~~~~~",{error});
                })

                req.log.info('File uploaded');
                const finalResponse = res.formatResult(result.statusCode,
                    result.data, endPointName);
                req.log.info('record inserted successfully');
                return res.status(finalResponse.status).json(finalResponse);
            }).catch((err) => Util.logAndSendErrorResponse(req, res, err, endPointName));
        //console.log(req.body.attributes)
    }else{
        const errorResponse = res.formatResult(400, {data:"Error in file uploading"}, endPointName);
        return res.status(errorResponse.status).json(errorResponse);
    }
}

module.exports.getFile = (req, res) => {
    var file = `${global.appRoot}/${req.params.folder}/${req.params.fileName}.${req.params.filextn}`;
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

module.exports.tweet = (req, res) => {
  twitterservice.tweet(Constants.DEPARTMENTS.ROAD,"Testiccng")
      .then(result => {
        console.log(result);
      }).catch(error => {
        console.log(error);
      })
}


module.exports.resize = (req, res) => {
  imageresize.resize('/home/dhruv/Downloads/266509.jpg', '/home/dhruv/Downloads/2.jpg', 200, 200)
      .then(data => {
          console.log(data)
      }).catch(err => {
            console.log(err)
      })
}


module.exports.getFileInfo = (req, res) => {
    const endPointName = Constants.ENDPOINTS.FILE_INFO;
    const fileUploadService = new FileUploadService(req.log);
    const category = getCategory((req.query.category && req.query.category != '')?req.query.category:"");
    fileUploadService.getFileInfo({
            fileName: (req.query.fileName && req.query.fileName != '')?req.query.fileName:"",
            category:category
        })
        .then((result) => {
            const finalResponse = res.formatResult(result.statusCode,
                result.data, endPointName);
            req.log.info('record fetched successfully');
            return res.status(finalResponse.status).json(finalResponse);
        }).catch((err) => Util.logAndSendErrorResponse(req, res, err, endPointName));
}

module.exports.detect = (req,res) => {
    new DepartmentDetectionService(req.log).detectDepartment().then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log("error----------------------------")
    });
}

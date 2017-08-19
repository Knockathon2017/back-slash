import Promise from 'bluebird';
import Constants from '../utils/constants';
import Util from '../utils/helper';

import DepartmentDetectionService from '../services/departmentDetectionService';
import WitService from '../services/witservices'
import TwitterServices from '../services/twitterservices';

const witservice = new WitService(global.settings.WITTOKEN || 'BPQTQ7I45PX6BDVVSHZRW5AYLHBFUVR4');
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
        case "rail":
            return Constants.DEPARTMENTS.RAIL;
        break;
    }
}

class JobManagerService {

    constructor(loggerInstance, emailService) {
        this.logger = loggerInstance;
        this.emailService = emailService;
    }

    triggerJob(data){
        this.logger.info(`Get a job to perform`)
        const fileName = data.fileName;
        const category = data.category;
        const isMedia = (fileName && fileName !="")?true:false;

        return new Promise((resolve, reject)=>{
            if(data.comMode == "qrcode" && category == Constants.ENUMS.GC){
                
                if(global.settings.COM_MODE == "email"){
                    console.log(`----------------------------Send mail----------------------`);
                    this.emailService.sendMail({
                        subject: "Activation code",
                        to: "eshu@yopmail.com",
                        html: "Hello <b>"+getDepartment(data.gMetadata.department)+"</b><\br>"+data.description+".<\br><\br>Thank you for choosing us."
                    });
                }else{
                    twitterservice.tweet(getDepartment(data.gMetadata.department),data.description).then((response) => {
                        return resolve({status:200,data:data});
                    }).catch((error) => {
                        return reject({status: 400, message: "Error in tweet for text", error:error});
                    });
                }
            }else if(isMedia && category == Constants.ENUMS.GC){
                const obj = new DepartmentDetectionService(this.logger);
                obj.detectDepartment(fileName).then((response)=>{
                    if(response.data.prediction){
                        this.logger.info(`Tweet our grvience image`);
                        if(global.settings.COM_MODE == "email"){
                            console.log(`----------------------------Send mail----------------------`);
                            this.emailService.sendMail({
                                subject: "Activation code",
                                to: "eshu@yopmail.com",
                                html: "Hello <b>"+getDepartment(response.data.prediction)+"</b><\br>"+data.description+".<\br><\br>Thank you for choosing us."
                            });
                        }else{
                            twitterservice.tweet(getDepartment(response.data.prediction),data.description,`${global.appRoot}/file_uploaded/${fileName}`).then((response) => {
                                return resolve({status:200,data:data});
                            }).catch((error) => {
                                return reject({status: 400, message: "Error in tweet", error:error});
                            });
                        }
                    }
                }).catch((error) => {
                    return reject(error);
                });
            } else if(!isMedia && category == Constants.ENUMS.GC){
                this.logger.info(`Tweet our grvience image`);

                witservice.context(data.description)
                .then(d => {
                    console.log(d);
                    if(d.tag == "profanity" || !d.tag)
                        return reject({status:400, message: "Irrevilate data."});

                    if(global.settings.COM_MODE == "email"){
                        console.log(`----------------------------Send mail----------------------`);
                        this.emailService.sendMail({
                            subject: "Activation code",
                            to: "eshu@yopmail.com",
                            html: "Hello <b>"+getDepartment(d.tag)+"</b><\br>"+data.description+".<\br><\br>Thank you for choosing us."
                        });
                    }else{
                        twitterservice.tweet(getDepartment(d.tag),data.description).then((response) => {
                            return resolve({status:200,data:data});
                        }).catch((error) => {
                            return reject({status: 400, message: "Error in tweet for text", error:error});
                        });
                    }
                }).catch(e => {
                    return reject({status: 400, message: "Error in tweet for text", error:error});
                })
            }
        });
    }
    
}

export default JobManagerService;
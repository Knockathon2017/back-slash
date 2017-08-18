'use strict';

import exRest from 'exframe-rest';
import bodyParser from 'body-parser';
import exfLogger from 'exframe-logger';
import mongoose from 'mongoose';
import path from 'path';
import bluebirdPromise from 'bluebird';
import routes from './routes'

import responseBuilder from './utils/responsebuilder';

const index = () => {
  const logger = exfLogger.create(global.settings.LOGSENETOKEN || 'token');
  const PORT = global.settings.PORT || 8787;
  
  global.appRoot = path.resolve(__dirname);
  const app = exRest.create(PORT);

  const Mongoose = bluebirdPromise.promisifyAll(mongoose);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  Mongoose.connect(global.settings.MONGODBURL, (err)=>{
    if(err){
        return logger.error('Error while connecting with mongo.');
    }
    logger.info('server started at port %s', PORT);
  });

  app.use((req, res, next) => {
    res.formatResult = (statusCode, result, endPointName) => {
      const returnObject = responseBuilder.formatResponse(statusCode, result, endPointName);
      return returnObject;
    };
    next();
  });

  app.use(`/v1`, routes);

  app.use((err, request, response, next) => {
    if (err instanceof SyntaxError && err.body) {
      const errorData = err ? err.body || err : {};
      request.log.warn('Syntax error in the request json.', { errorData });
      const inValidJsonResponse = {
        status: 400,
        message: 'The request could not be understood by the server due to malformed syntax'
      };
      return response.status(400).json(inValidJsonResponse);
    }

    if (err) {
      request.log.error('Unknown error in middleware', { errorData: err });
      const unknonwErrorResponse = {
        status: 500,
        message: 'Internal server error.'
      };
      return response.status(500).json(unknonwErrorResponse);
    }
    next();
  });

  //logger.info('server started at port %s', PORT);
};

export default index;

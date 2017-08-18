'use strict';

import express from 'express';
import multer from 'multer';
const path = require('path');

import routeLogic from './logic';

const router = new express.Router();
//const upload = multer({ dest: 'file_uploaded/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'file_uploaded/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

router.post('/register', routeLogic.registerUser);

router.post('/gText', upload.any(), routeLogic.gText);

router.post('/uploadFile', upload.any(), routeLogic.uploadFile);

router.get('/getFile/:fileName.:filextn',routeLogic.getFile);

router.get('/getFileInfo', routeLogic.getFileInfo);

router.get('/detect', routeLogic.detect);

router.post('/context', routeLogic.wit);

export default router;

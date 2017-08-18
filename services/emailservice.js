const gmail = require('gmail-send');

const emailService = {};

const send = gmail({
  user: 'teambackslash2017@gmail.com',
  pass: 'Password@123',
  to:   'eshug@yopmail.com',
  // from:    credentials.user             // from: by default equals to user 
  // replyTo: credentials.user             // replyTo: by default undefined 
  subject: 'test subject',
  text:    'gmail-send example 1',         // Plain text 
  //html:    '<b>html text</b>'            // HTML 
});


emailService.sendMail = (mailObject)=>{
    send(mailObject, function (err, res) {
        console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
    });
}

module.exports = emailService;

import {Wit} from 'node-wit';

  export default class WitService{

  constructor(wittoken){
    console.log("-------- "+wittoken);
    this.client  = new Wit({accessToken: wittoken});
  }

  context(message) {
      return new Promise((resolve, reject) => {
          this.client.message(message)
          .then(data => {
             const d = this.processData(data);
             resolve(d);
          }).catch(err => {
              reject(err);
          })
      });
  }


  processData(data) {
    let loc;
    let tag;

      if(data.entities){
          const location = data.entities.location;
          if(location == null){
              loc = [];
          }else {
            loc = location.map(o => o.value);
          }

          const tag_type = data.entities.tag_type;

          if(tag_type == null){
              tag == "";
          }else{
            const values = tag_type.map(o => o.value);
            if(values.indexOf("profanity") != -1){
              return {tag: "profanity"};
            }
            if(values.indexOf("garbage") != -1){
              tag = "garbage"
            }else if(values.indexOf("road") != -1){
              tag = "road"
            }else{
              tag = values[0];
            }
          }

          return {
            loc : loc,
            tag : tag
          }

      } else{
        return {};
      }

  }

}

import Constants from "../utils/constants";
import Twitter from 'node-twitter';

export default class TwitterServices {

  constructor(logger) {
    this.twitterRestClient = new Twitter.RestClient(global.settings.TWITTER_CONSUMER_KEY || '5szxUMw49YRtMyrls0uDRE3v2', global.settings.TWITTER_CONSUMER_SECRET || 'A3iGnbOULO9rnzh7xCsSHZyCXYDtCLjaiSZcuGtxZk0WTRgaQg',
      global.settings.TWITTER_TOKEN || '898594475554914308-0M6pfAyNzHBOGPlujyWlu3Wm2gDt7AV',
      global.settings.TWITTER_SECRET || '9UMimZhvgzlnTSK5vAqcbXoxSnbfHzVl2M18JkjCKI1r3');
  }


  tweet(department, tweet, filePath) {
    let status = "";
    if (department == Constants.DEPARTMENTS.ROAD) {
      status = "@RoadsDept "+ tweet;
    } else if (department == Constants.DEPARTMENTS.GARBAGE) {
      status = "@RoadsDept "+ tweet
    } else if (department == Constants.DEPARTMENTS.RAIL) {
      status = "@ElectricityDept "+ tweet
    }

    const dp = this.dataToPost(status, filePath);

    if(filePath){
    return new Promise((resolve, reject) => {
        this.twitterRestClient.statusesUpdateWithMedia(dp, function(error, result) {
          if (error) {
            return reject(error);
          }

          if (result) {
            return resolve(result);
          }
        })
      });
    }else{
      return new Promise((resolve, reject) => {
        this.twitterRestClient.statusesUpdate(dp, function(error, result){
          if (error) {
            return reject(error);
          }

          if (result) {
            return resolve(result);
          }
        });
        
      })
    }

    }



    dataToPost(status, filePath) {
      if (filePath) {
        return {
          'status': status,
          'media[]': filePath
        }
      } else {
        return {
          status: status
        }
      }
    }

  }

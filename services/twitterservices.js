import Constants from "../utils/constants";
import Twitter from 'twitter';
import fs from 'fs';

export default class TwitterServices {

  constructor(logger) {
    this.client = new Twitter({
      consumer_key: global.settings.TWITTER_CONSUMER_KEY || '5szxUMw49YRtMyrls0uDRE3v2',
      consumer_secret: global.settings.TWITTER_CONSUMER_SECRET || 'A3iGnbOULO9rnzh7xCsSHZyCXYDtCLjaiSZcuGtxZk0WTRgaQg',
      access_token_key: global.settings.TWITTER_TOKEN || '898594475554914308-0M6pfAyNzHBOGPlujyWlu3Wm2gDt7AV',
      access_token_secret: global.settings.TWITTER_SECRET || '9UMimZhvgzlnTSK5vAqcbXoxSnbfHzVl2M18JkjCKI1r3'
    });
  }

  tweet(department, tweet, filePath) {
    let status = "";
    if (department == Constants.DEPARTMENTS.ROAD) {
      status = "@RoadsDept " + tweet;
    } else if (department == Constants.DEPARTMENTS.GARBAGE) {
      status = "@GarbageDept " + tweet
    } else if (department == Constants.DEPARTMENTS.RAIL) {
      status = "@ElectricityDept " + tweet
    }

    const dp = this.dataToPost(status, filePath);
    const self = this;
    if (filePath) {
      return new Promise((resolve, reject) => {
        let data = fs.readFileSync(filePath);
        this.client.post('media/upload', {
          media: data
        }, function(error, media, response) {
          if (error) {
            reject(error);
          }

          let s = {
            status: status,
            media_ids: media.media_id_string // Pass the media id string
          }

          self.client.post('statuses/update', s, function(error, tweet, response) {
            if (!error) {
              resolve(response);
            } else {
              reject(error);
            }
          });

        });

      })
    } else {
      return new Promise((resolve, reject) => {
        this.client.post('statuses/update', dp, function(error, tweet, response) {
          if (error) {
            reject(error);
          }else{
              resolve(response);
          }
        });

      })
    }
  }

    dataToPost(status, filePath) {
      if (filePath) {
        return {'status': status, 'media[]': filePath}
      } else {
        return {'status': status}
      }
    }

  }

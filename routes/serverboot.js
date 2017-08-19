import WitService from '../services/witservices'
import TwitterServices from '../services/twitterservices';

const witservice = new WitService(global.settings.WITTOKEN || 'BPQTQ7I45PX6BDVVSHZRW5AYLHBFUVR4');
const twitterservice = new TwitterServices();

export{
  witservice,
  twitterservice
}
  

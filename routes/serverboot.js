import WitService from '../services/witservices'
import TwitterServices from '../services/twitterservices';
import ImageResize from '../services/imageresize';


const witservice = new WitService(global.settings.WITTOKEN || 'BPQTQ7I45PX6BDVVSHZRW5AYLHBFUVR4');
const twitterservice = new TwitterServices();
const imageresize = new ImageResize();

export{
  witservice,
  twitterservice,
  imageresize
}

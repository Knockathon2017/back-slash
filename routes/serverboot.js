import WitService from '../services/witservices'

const witservice = new WitService(global.settings.WITTOKEN || 'BPQTQ7I45PX6BDVVSHZRW5AYLHBFUVR4');

export{
  witservice
}

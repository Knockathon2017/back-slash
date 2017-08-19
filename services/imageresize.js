import sharp from 'sharp';

export default class ImageResizeService {


  resize(inputPath, outputpath, l, w) {

    return new Promise((resolve, reject) => {
      sharp(inputPath)
        .resize(l, w)
        .toFile(outputpath, (err, info) => {

            if(err){
              reject(err)
            }else{
              resolve(outputpath);
            }

        });
    });



  }


}

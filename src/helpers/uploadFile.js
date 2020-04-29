const { createWriteStream, unlink } = require('fs');
// const mkdirp = require('mkdirp');
const shortid = require('shortid');
const cloudinary = require('cloudinary').v2
// const { ApolloServer } = require('apollo-server-koa')
// const FileSync = require('lowdb/adapters/FileSync')
// const { schema } = require('./schema')

const UPLOAD_DIR = './uploads'

// mkdirp.sync(UPLOAD_DIR);

export const storeUpload = async (upload, oldFile = '', folderImage = '') => {
  try {

    const { createReadStream, filename, mimetype } = await upload;

    cloudinary.config({
      cloud_name: process.env.CD_CLOUD_NAME,
      api_key: process.env.CD_API_KEY,
      api_secret: process.env.CD_API_SECRET
    })

    const stream = createReadStream();
    const id = shortid.generate();
    const path = `${UPLOAD_DIR}/${id}-${filename}`;
    const file = { id, filename, mimetype, path };
    const uniqueFilename = new Date().toISOString();

    if (oldFile) {
      let oldImage = oldFile.split('/');
      oldImage = oldImage[oldImage.length - 1].split('.').slice(0, -1).join('.');
      let publicId = `${folderImage}/${oldImage}`;
      const responseDeleted = await cloudinary.uploader.destroy(publicId);
      console.log(responseDeleted);
    }

    let resultUrl = '';
    const url = await new Promise((resolve, reject) => {
      const streamLoad = cloudinary.uploader.upload_stream({public_id: `${folderImage}/${uniqueFilename}`, tags: `${folderImage}`},function (error, result) {
        if (result) {
          // console.log("result ", result);
          resultUrl = result.secure_url;
          resolve(resultUrl);
        }
        else console.log("error ", error);
      });

      stream.pipe(streamLoad);
    });

    // const response = await cloudinary.uploader.upload(stream, { public_id: `${folderImage}/${uniqueFilename}`, tags: `${folderImage}` });

    // console.log(url);
    return url;
  } catch (error) {
    console.log(error);
  }
}


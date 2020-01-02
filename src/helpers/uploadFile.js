const { createWriteStream, unlink } = require('fs');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
const cloudinary = require('cloudinary').v2
// const { ApolloServer } = require('apollo-server-koa')
// const FileSync = require('lowdb/adapters/FileSync')
// const { schema } = require('./schema')

const UPLOAD_DIR = './uploads'

mkdirp.sync(UPLOAD_DIR);

export const storeUpload = async (upload,oldFile = '',folderImage = '') => {
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

    if(oldFile) {
      let oldImage = oldFile.split('/');
      oldImage = oldImage[oldImage.length-1].split('.').slice(0, -1).join('.');
      let publicId = `${folderImage}/${oldImage}`;
      const responseDeleted = await cloudinary.uploader.destroy(publicId);
      console.log(responseDeleted);
    }
    // Store the file in the filesystem.
    const url = await new Promise((resolve, reject) => {
      stream
      .on('error', error => {
        unlink(path, () => {
          reject(error)
        })
      })
      .pipe(createWriteStream(path))
      .on('error', reject)
      .on('finish', async res => {
          const response = await cloudinary.uploader.upload( path, { public_id: `${folderImage}/${uniqueFilename}`, tags: `${folderImage}` });
          // console.log(response);
          resolve(response.url);
        })
    })

    // Record the file metadata in the DB.
    // db.get('uploads').push(file).write();

    return url;
  } catch (error) {
    console.log(error);
  }
}


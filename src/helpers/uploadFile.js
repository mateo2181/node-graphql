const { createWriteStream, unlink } = require('fs');
const mkdirp = require('mkdirp');
const shortid = require('shortid');
// const { ApolloServer } = require('apollo-server-koa')
// const Koa = require('koa')
// const lowdb = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const { schema } = require('./schema')

const UPLOAD_DIR = './uploads'

mkdirp.sync(UPLOAD_DIR);

export const storeUpload = async upload => {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();
    const id = shortid.generate();
    const path = `${UPLOAD_DIR}/${id}-${filename}`;
    const file = { id, filename, mimetype, path };
  
    // Store the file in the filesystem.
    await new Promise((resolve, reject) => {
      stream
        .on('error', error => {
          unlink(path, () => {
            reject(error)
          })
        })
        .pipe(createWriteStream(path))
        .on('error', reject)
        .on('finish', resolve)
    })
  
    // Record the file metadata in the DB.
    // db.get('uploads').push(file).write();
  
    return `${id}-${filename}`;
  }


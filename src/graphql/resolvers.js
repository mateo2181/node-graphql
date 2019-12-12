const { UserInputError } = require('apollo-server');
import { storeUpload } from '../helpers/uploadFile';
import { login } from '../auth/index';
export default {
    Author: {
        books: (parent, args, context, info) => parent.getBooks(),
    },
    Book: {
        author: (parent, args, context, info) => parent.getAuthor(),
    },
    Query: {
        books: (parent, args, { db }, info) => db.Book.findAll(),
        authors: (parent, args, { db }, info) => db.Author.findAll(),
        book: (parent, { id }, { db }, info) => db.Book.findByPk(id),
        author: (parent, { id }, { db }, info) => db.Author.findByPk(id),
        getUserLogged: (parent, args, { decoded, db }, info) => {
            // console.log(decoded);
            return { email: decoded.email };
        }
    },
    Mutation: {
        createAuthor: (parent, { firstName, lastName }, { db }, info) => {
            if (!firstName || !lastName) {
                throw new UserInputError('Form Arguments invalid', {
                    invalidArgs: "FirstName and LastName are required",
                });
            }
            return db.Author.create({
                firstName,
                lastName
            })
        },
        deleteAuthor: (parent, { id }, { db }, info) => {
            db.Author.destroy({
                where: { id }
            });
            return id;
        },
        createBook: async (parent, { title, description, authorId, file }, { db }, info) => {
            // const { stream, mimetype } = await file;
            let filenameSaved = null;
            // console.log(file);
            if (file) {
                filenameSaved = await storeUpload(file);
            }
            return db.Book.create({
                title,
                description,
                authorId,
                image: filenameSaved ? filenameSaved : ''
            });
        },
        singleUploadBook: (parent, { file }, { db }, info) => {
            return storeUpload(file);
        },
        deleteBook: (parent, { id }, { db }, info) => {
            db.Book.destroy({ where: { id } });
            return id;
        },
        login: (parent, { email, password }, { db }, info) => {
            return login(email, password);
        }
    }
};
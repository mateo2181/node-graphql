const { PubSub, UserInputError } = require('apollo-server');
import { storeUpload } from '../helpers/uploadFile';
import { login } from '../auth/index';

const pubsub = new PubSub();
const NEW_AUTHOR = 'NEW_AUTHOR';

export default {
    Author: {
        books: (parent, args, context, info) => parent.getBooks(),
    },
    Book: {
        author: (parent, args, context, info) => parent.getAuthor(),
    },
    Subscription: {
        newAuthor: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([NEW_AUTHOR]),
        },
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
        createAuthor: async (parent, { firstName, lastName, description, nationality, file }, { db }, info) => {
            if (!firstName || !lastName || !nationality) {
                throw new UserInputError('Form Arguments invalid', {
                    invalidArgs: "All files are required",
                });
            }
            let filenameSaved = null;
            if (file) {
                filenameSaved = await storeUpload(file);
            }

            let author = db.Author.create({
                firstName,
                lastName,
                description,
                nationality,
                image: filenameSaved ? filenameSaved : ''
            })

            pubsub.publish(NEW_AUTHOR, { newAuthor: author });
            return author;
        },
        editAuthor: async (parent, { id, firstName, lastName, description, nationality, file }, { db }, info) => {
            if (!firstName || !lastName || !nationality) {
                throw new UserInputError('Form Arguments invalid', {
                    invalidArgs: "All files are required",
                });
            }
            let author = await db.Author.findByPk(id);
            let filenameSaved = author.image;
            if (file) {
                filenameSaved = await storeUpload(file);
            }

            author.firstName = firstName;
            author.lastName = lastName;
            author.description = description || author.description;
            author.nationality = nationality;
            author.image = filenameSaved;
            await author.save();

            return author;
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
        editBook: async (parent, { id,title, description, authorId, file }, { db }, info) => {
            // const { stream, mimetype } = await file;
            let book = await db.Book.findByPk(id);
            let filenameSaved = book.image;
            if (file) {
                filenameSaved = await storeUpload(file);
            }
            book.title = title;
            book.description = description || book.description;
            book.authorId = authorId;
            book.image = filenameSaved;
            await book.save();
            return book;
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
const { PubSub, UserInputError } = require('apollo-server');
import { storeUpload } from '../helpers/uploadFile';
import { login } from '../auth/index';
// const { PrismaClient } = require("@prisma/client");

const pubsub = new PubSub();
const NEW_AUTHOR = 'NEW_AUTHOR';

// const prisma = new PrismaClient()

export default {
    Subscription: {
        newAuthor: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([NEW_AUTHOR]),
        },
    },
    Query: {
        books: async (parent, args, { prisma }, info) => {
            let skip = args.offset || 0;
            let limit = args.limit || null;
            return await prisma.books.findMany({
                first: limit,
                skip,
                include: { author: true }
            });
            // return db.Book.findAll({
            //     limit, 
            //     offset,
            //     order: [["title", "ASC"]]
            // })
        },
        authors: async (parent, args, { prisma }, info) => {
            let skip = args.offset || 0;
            let limit = args.limit || null;
            return await prisma.authors.findMany({
                first: limit,
                skip,
                include: { books: true }
            });
        },
        book: (parent, { id }, { prisma }, info) => {
            return prisma.books.findOne({ where: { id: Number(id) }, include: { author: true } })
        },
        author: (parent, { id }, { prisma }, info) => {
            return prisma.authors.findOne({ where: { id: Number(id) }, include: { books: true } })
        },
        getUserLogged: (parent, args, { decoded, prisma }, info) => {
            // console.log(decoded);
            return { email: decoded.email };
        }
    },
    Mutation: {
        createAuthor: async (parent, { firstName, lastName, description, nationality, file }, { prisma }, info) => {
            if (!firstName || !lastName || !nationality) {
                throw new UserInputError('Form Arguments invalid', {
                    invalidArgs: "All files are required",
                });
            }
            const descriptionText = description || '';
            let filenameSaved = null;
            if (file) {
                filenameSaved = await storeUpload(file, filenameSaved, 'authors');
            }

            const author = await prisma.authors.create({
                data: {
                    firstName,
                    lastName,
                    description: descriptionText,
                    nationality,
                    image: filenameSaved ? filenameSaved : ''
                }
            })

            pubsub.publish(NEW_AUTHOR, { newAuthor: author });
            return author;
        },
        editAuthor: async (parent, { id, firstName, lastName, description, nationality, file }, { prisma }, info) => {
            if (!firstName || !lastName || !nationality) {
                throw new UserInputError('Form Arguments invalid', {
                    invalidArgs: "All files are required",
                });
            }
            let author = await prisma.authors.findOne({ where: { id: Number(id) } });
            let filenameSaved = author.image;
            if (file) {
                filenameSaved = await storeUpload(file, filenameSaved, 'authors');
            }

            author = await prisma.authors.update({
                where: { id: Number(id) },
                data: {
                    firstName,
                    lastName,
                    description: description || author.description,
                    nationality,
                    image: filenameSaved
                }
            });

            return author;
        },
        deleteAuthor: async (parent, { id }, { prisma }, info) => {
            await prisma.authors.delete({
                where: { id: Number(id) }
            });
            return id;
        },
        createBook: async (parent, { title, description, authorId, file }, { prisma }, info) => {
            // const { stream, mimetype } = await file;
            let filenameSaved = null;
            if (file) {
                filenameSaved = await storeUpload(file, filenameSaved, 'books');
            }
            const book = await prisma.books.create({
                data: {
                    title,
                    description,
                    author: {
                        connect: { id: Number(authorId) }
                    },
                    image: filenameSaved ? filenameSaved : ''
                }
            });
            return book;
        },
        editBook: async (parent, { id, title, description, authorId, file }, { prisma }, info) => {
            // const { stream, mimetype } = await file;
            let book = await prisma.books.findOne({ where: { id: Number(id) } });
            let filenameSaved = book.image;
            if (file) {
                filenameSaved = await storeUpload(file, filenameSaved, 'books');
            }

            book = await prisma.books.update({
                where: { id: Number(id) },
                data: {
                    title,
                    description: description || book.description,
                    image: filenameSaved,
                    author: {
                        connect: { id: Number(authorId) }
                    }
                },
                include: {
                    author: true   
                }
            });

            return book;
        },
        deleteBook: async (parent, { id }, { prisma }, info) => {
            await prisma.books.delete({
                where: { id: Number(id) }
            });
            return id;
        },
        login: (parent, { email, password }, { db }, info) => {
            return login(email, password);
        }
    }
};
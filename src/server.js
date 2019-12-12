const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
import { ApolloServer, gql, AuthenticationError } from "apollo-server-express";
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import db from "./models";
import authRouter from './auth/routes.js';
import authService from './auth/index';

// Put together a schema
const server = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.token || ''
        // console.log(req.body);
        if (req.body.operationName == 'LoginMutation') return;
        try {
            let decoded = await authService.verifyUser(token);
            console.log(decoded);
            return { decoded, db };
        } catch (e) {
            // throw new Error(e);
            throw new AuthenticationError('Authentication token is invalid, please log in')
        }
    },
    engine: {
        rewriteError(err) {
            // Return `null` to avoid reporting `AuthenticationError`s
            if (err instanceof AuthenticationError) {
                return null;
            }
            // All other errors will be reported.
            return err;
        }
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.json())

server.applyMiddleware({ app });

// Routes Rest
app.use('/auth', authRouter);
app.use(express.static('uploads'));

// The `listen` method launches a web server.
app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at port 4000`);
});
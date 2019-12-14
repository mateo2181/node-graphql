const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const rateLimit = require("express-rate-limit")
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
        // Por el momento sacamos el AUTH.
        return { db };
        if (req.body.operationName == 'LoginMutation') return;
        try {
            let decoded = await authService.verifyUser(token);
            console.log(decoded);
            return { decoded, db };
        } catch (e) {
            throw new AuthenticationError('Authentication token is invalid, please log in')
        }
    },
    engine: {
        rewriteError(err) {
            // Return `null` to avoid reporting `AuthenticationError`s
            // if (err instanceof AuthenticationError) {
            //     return null;
            // }
            // All other errors will be reported.
            return err;
        }
    }
});

const app = express();
app.use(cors());
app.use(bodyParser.json())

server.applyMiddleware({ app });

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);

// Routes Rest
app.use('/auth', authRouter);
app.use(express.static('uploads'));

// The `listen` method launches a web server.
app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀  Server ready at port 4000`);
});
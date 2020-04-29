const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const rateLimit = require("express-rate-limit")
// import { ApolloServer, gql, AuthenticationError } from "apollo-server-express";
const { ApolloServer, gql } = require('apollo-server-lambda');
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import authRouter from './auth/routes.js';
import authService from './auth/index';
import { createContext } from './context';

// Put together a schema
const server = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    context: async ({ event, context }) => {
        // if (connection) return connection.context;
        return {  
            headers: event.headers,
            event,
            context,
            prisma: createContext()
        };
        const token = req.headers.token || ''
        // Por el momento sacamos el AUTH.
        if (req.body.operationName == 'LoginMutation') return;
        // try {
        //     let decoded = await authService.verifyUser(token);
        //     console.log(decoded);
        //     return { decoded, db };
        // } catch (e) {
        //     throw new AuthenticationError('Authentication token is invalid, please log in')
        // }
    },
    playground: true
});

// const app = express();
// app.use(cors());
// app.use(bodyParser.json())

// server.applyMiddleware({ app });
// const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
//  apply to all requests
// app.use(limiter);

// Routes Rest
// app.use('/auth', authRouter);
// app.use(express.static('uploads'));

// The `listen` method launches a web server.
// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, (e) => {
//     console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
//     console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
// });

const graphqlHandler = (event, context, callback) => {
    if (Object.keys(event.headers).includes('Content-Type')) {
        event.headers['content-type'] = event.headers['Content-Type'];
    }
    const handler = server.createHandler({
        cors: {
            origin: true,
            credentials: true
        }
    });
    return handler(event, context, callback);
};

export { graphqlHandler }
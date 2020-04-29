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
        /** Authentication **/
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
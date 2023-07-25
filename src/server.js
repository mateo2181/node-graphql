import { ApolloServer } from '@apollo/server'
import gql from 'graphql-tag'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda'
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'
import { createContext } from './context'

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
    }
    // const token = req.headers.token || ''
    /** Authentication **/
    // if (req.body.operationName == 'LoginMutation') return
    // try {
    //     let decoded = await authService.verifyUser(token);
    //     console.log(decoded);
    //     return { decoded, db };
    // } catch (e) {
    //     throw new AuthenticationError('Authentication token is invalid, please log in')
    // }
  },
  playground: true
})

const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
)

export { graphqlHandler }

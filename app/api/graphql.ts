// pages/api/graphql.ts
import { ApolloServer } from '@apollo/server';
import { schema } from '../../graphql/schema';
import strtSer

const apolloServer = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });

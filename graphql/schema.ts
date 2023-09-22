// graphql/schema.ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    greeting: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL Server!',
    },
  },
});

export const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: `
    type Query {
      greeting: String
    }
  `,
  resolvers: {
    Query: {
      greeting: () => 'Hello, GraphQL Server!',
    },
  },
});

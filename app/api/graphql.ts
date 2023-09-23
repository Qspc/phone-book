// pages/api/graphql.js
import { ApolloServer } from '@apollo/server';
import { gql } from '@apollo/client';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// const { url } = startStandaloneServer(server, {
//   listen: { port: 3000 },
// });

import { SchemaLink } from 'apollo-link-schema';
import { HttpLink } from 'apollo-link-http';
import { FieldNode, visit, Kind, SelectionNode, SelectionSetNode } from 'graphql';
import { makeExecutableSchema, addMockFunctionsToSchema, makeRemoteExecutableSchema, introspectSchema, transformSchema, WrapQuery, ExtractField, mergeSchemas } from 'graphql-tools';
import ReplaceQuery from './ReplaceQueryTransform';

const link = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const contractSchema = makeExecutableSchema({
  typeDefs: `
    type SimpleStorageQuery {
      get: SimpleStorage_get
    }

    type SimpleStorage_get {
      x: Int
    }

    type SimpleStorageMutation {
      set(x: Int!): Boolean # should be receipt
    }

    type Query {
      SimpleStorage: SimpleStorageQuery
    }

    type Mutation {
      SimpleStorage: SimpleStorageMutation
    }
  `
});

export default async () => {
  const typeDefs = await introspectSchema(link);

  const ethqlSchema = makeRemoteExecutableSchema({
    schema: typeDefs,
    link,
  });

  const schema = transformSchema(
    mergeSchemas({
      schemas: [
        ethqlSchema,
        contractSchema,
      ],
    }),
    [
      {
        transformRequest: request => {
          console.log('Before', request);
          return request;
        },
      },
      new ReplaceQuery(
        ['SimpleStorage'],
        (subtree) => {
          console.log(subtree)
          return {
            kind: Kind.FIELD,
            name: {
              kind: Kind.NAME,
              value: 'call',
            },
            arguments: [
              {
                kind: Kind.ARGUMENT,
                name: {
                  kind: Kind.NAME,
                  value: 'data',
                },
                value: {
                  kind: Kind.STRING,
                  value: 'TODO: actual data'
                },
              }
            ],
          };
        },
        result => ({
          get: {
            x: 5,
          },
        }),
      ),
      {
        transformRequest: request => {
          console.log('After', request);
          return request;
        },
      },
    ],
  );
  
  return new SchemaLink({ schema });
}

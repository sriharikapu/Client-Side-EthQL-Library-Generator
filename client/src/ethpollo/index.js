import { SchemaLink } from 'apollo-link-schema';
import { HttpLink } from 'apollo-link-http';
import { Kind } from 'graphql';
import {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
  introspectSchema,
  transformSchema,
  mergeSchemas,
} from 'graphql-tools';
import { AbiCoder } from 'web3-eth-abi';

import ReplaceQuery from './ReplaceQueryTransform';

const link = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const abiCoder = new AbiCoder();

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
          const functionName = subtree.selections[0].name.value;
          const data = abiCoder.encodeFunctionCall({
            name: functionName,
            type: 'function',
            inputs: [], // TODO: determine based on function name
          }, []);
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
                  kind: Kind.OBJECT,
                  fields: [{
                    kind: Kind.OBJECT_FIELD,
                    name: {
                      kind: Kind.NAME,
                      value: 'from'
                    },
                    value: {
                      kind: Kind.STRING,
                      value: '0x0cb0079936dce60fcba8eff2c76f1ee64b303bad'
                    }
                  }, {
                    kind: Kind.OBJECT_FIELD,
                    name: {
                      kind: Kind.NAME,
                      value: 'to'
                    },
                    value: {
                      kind: Kind.STRING,
                      value: '0x0cb0079936dce60fcba8eff2c76f1ee64b303bad'
                    }
                  }, {
                    kind: Kind.OBJECT_FIELD,
                    name: {
                      kind: Kind.NAME,
                      value: 'data'
                    },
                    value: {
                      kind: Kind.STRING,
                      value: data
                    }
                  }],
                },
              },
            ],
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [
                {
                  kind: Kind.FIELD,
                  name: {
                    kind: Kind.NAME,
                    value: 'data',
                  }
                }
              ]
            }
          };
        },
        result => {
          return {
            get: {
              x: 5,
            },
          };
        },
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

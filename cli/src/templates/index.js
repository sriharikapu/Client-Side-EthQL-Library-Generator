module.exports = (parsedContractDataArray) => {

  function mapEvents(parsedContractData) {
    const eventsArray = Object.entries(parsedContractData.data.events);
    if (eventsArray.length > 0) {
      return eventsArray.map(event => event[0]).join('\n');
    } else {
      return '';
    }
  }

  function printSubtreeMethod(method) {
    return `const data = abiCoder.encodeFunctionCall({
            name: ${method[0]},
            type: 'function',
            inputs: ${Object.entries(method[1].input)[0][1][0] ? `[
              name: '${Object.entries(method[1].input)[0][1][0].name}',
              type: '${Object.entries(method[1].input)[0][1][0].type.name}',
            ]` : `[]`},
          }, []);`;
  }

  function printSubtreeGeneral() {
    return `
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
        },`;
  }

  return result = `// This file was generated with the cli

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
  typeDefs: \`${parsedContractDataArray.map(parsedContractData => {
      return Object.entries(parsedContractData.data.constants).map(constant => {
        return `
    type ${parsedContractData.name}Query {
      ${parsedContractData.name}_${constant[0]}
    }
    `
      }).join('');
    }).join('')}${parsedContractDataArray.map(parsedContractData => {
      const constantsArray = Object.entries(parsedContractData.data.constants);
      return constantsArray.map(constant => {
        return `
    type ${parsedContractData.name}_${constant[0]} {
      ${constant[1].output.map(output => {
        return `${output.name}: ${output.type.name}`
      })}
    }
    `
      }).join('');
    }).join('')}${parsedContractDataArray.map(parsedContractData => {
      const methodsArray = Object.entries(parsedContractData.data.methods);
      return methodsArray.map(method => {
        return `
    type ${parsedContractData.name}Mutation {
      ${Object.entries(method[1].input).toString().split('(')[0]}(${Object.entries(method[1].input)[0][1][0].name}: ${Object.entries(method[1].input)[0][1][0].type.name}): Boolean # should be receipt
    }
    `
      }).join('');
    }).join('')}
    type Query {${parsedContractDataArray.map(parsedContractData => {
      return `
      ${parsedContractData.name}: ${parsedContractData.name}Query`
    }).join('')}
    }

    type Mutation {${parsedContractDataArray.map(parsedContractData => {
      return `
      ${parsedContractData.name}: ${parsedContractData.name}Mutation`
    }).join('')}
    }
  \`
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
      new ReplaceQuery(${parsedContractDataArray.map(parsedContractData => {
          const constantsArray = Object.entries(parsedContractData.data.constants);
          const methodsArray = Object.entries(parsedContractData.data.methods);
          if (constantsArray.length > 0) {
            return constantsArray.map(constant => {
              return `
        ['${parsedContractData.name}', '${constant[0]}'],
        subtree => {
          // TODO: get params from subtree
          ${printSubtreeMethod(constant)}${printSubtreeGeneral()}
        result => {
          console.log('result', result);
          return {
            data: {
              ${parsedContractData.name}: {
                ${constant[0]}: ${Object.entries(constant[1].input)[0][1][0] ? `{
                  ${Object.entries(constant[1].input)[0][1][0].name}: 5, # should not be 5
                }` : `{}`
              },
            },
          };
        },`}).join('')
          } else {
            return '';
          }
          if (methodsArray.length > 0) {
            return methodsArray.map(method => {
              return `
        ['${parsedContractData.name}', '${method[0]}'],
        subtree => {
          // TODO: get params from subtree
          ${printSubtreeMethod(method)}
          ${printSubtreeGeneral()}
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
          console.log('result', result);
          return {
            data: {
              ${parsedContractData.name}: {
                ${method[0]}: ${Object.entries(method[1].input)[0][1][0] ? `{
                  ${Object.entries(method[1].input)[0][1][0].name}: 5, # should not be 5
                }` : `{}`
              },
            },
          };
        },`}).join('')
      } else {
        return '';
      }
      })},
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
`;
}

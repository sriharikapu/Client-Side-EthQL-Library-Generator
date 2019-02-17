import { WrapQuery } from 'graphql-tools';
import { visit, Kind } from 'graphql';

export default class ReplaceQuery extends WrapQuery {
  transformRequest(originalRequest) {
    const document = originalRequest.document;
    const fieldPath = [];
    const ourPath = JSON.stringify(this.path);
    const newDocument = visit(document, {
      [Kind.FIELD]: {
        enter: (node) => {
          fieldPath.push(node.name.value);
          if (ourPath === JSON.stringify(fieldPath)) {
            return this.wrapper(node.selectionSet);
          }
        },
        leave: (node) => {
          fieldPath.pop();
        }
      }
    });
    // TODO: build a document with SelectionSet containing both original and call
    return {
      ...originalRequest,
      document: newDocument
    };
  }
}

import { WrapQuery } from 'graphql-tools';
import { visit, Kind } from 'graphql';

export default class ReplaceQuery extends WrapQuery {
  transformRequest(originalRequest) {
    const document = originalRequest.document;
    const fieldPath = [];
    const ourPath = JSON.stringify(this.path);
    let ourNode;
    const newDocument = visit(document, {
      [Kind.FIELD]: {
        enter: (node) => {
          fieldPath.push(node.name.value);
          if (ourPath === JSON.stringify(fieldPath)) {
            ourNode = this.wrapper(node.selectionSet);
          }
        },
        leave: (node) => {
          fieldPath.pop();
        }
      }
    });
    if (ourNode) newDocument.definitions[0].selectionSet.selections.push(ourNode);
    return {
      ...originalRequest,
      document: newDocument
    };
  }

  transformResult(originalResult) {
    return originalResult.data[this.path[0]] !== undefined ? this.extractor(originalResult) : originalResult;
  }
}

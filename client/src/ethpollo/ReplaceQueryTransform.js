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
    return {
      ...originalRequest,
      document: newDocument
    };
  }

  // transformResult(originalResult) {
  //   const rootData = originalResult.data;
  //   if (rootData) {
  //     let data = rootData;
  //     const path = [...this.path];
  //     while (path.length > 1) {
  //       const next = path.shift();
  //       if (data[next]) {
  //         data = data[next];
  //       }
  //     }
  //     data[path[0]] = this.extractor(data[path[0]]);
  //   }

  //   return {
  //     data: rootData,
  //     errors: originalResult.errors
  //   };
  // }
}

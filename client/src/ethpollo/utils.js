export const genConfigFromDoc = tree =>
  tree.reduce((acc, field) => {
    if (field.kind === 'Field' && field.selectionSet) {
      acc[field.name.value] = genConfigFromDoc(field.selectionSet.selections);
    }

    if (field.directives && field.directives.length > 0) {
      const directive = field.directives
        .find(d => d.name.value === 'computed')
        .arguments.find(arg => arg.name.value === 'value');

      acc[field.name.value] = directive.value.value;
    }

    return acc;
  }, {});

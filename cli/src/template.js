module.exports = (parsedContractDataArray) => {

  return result = `// Created from template

${parsedContractDataArray.map(parsedContractData => `// ${parsedContractData.name}
${Object.entries(parsedContractData.data.methods).map(method => `
export const ${method[0]} ({ ... }) {

}
`).join('')}
`).join('')}`;
}

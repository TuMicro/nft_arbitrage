export const sleep = function (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const chunker = function<T> (array: T[], chunk_length: number) {
  const chunks = [];
  let temparray;
  const j=array.length;
  for (let i=0; i<j; i+=chunk_length) {
      temparray = array.slice(i,i+chunk_length);
      chunks.push(temparray);
  }
  return chunks;
}
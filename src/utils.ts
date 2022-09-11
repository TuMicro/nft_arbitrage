export const sleep = function (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const chunker = function <T>(array: T[], chunk_length: number) {
  const chunks = [];
  let temparray;
  const j = array.length;
  for (let i = 0; i < j; i += chunk_length) {
    temparray = array.slice(i, i + chunk_length);
    chunks.push(temparray);
  }
  return chunks;
}

type ValueOf<T> = T[keyof T];

export function getEnumKeyByEnumValue<R extends (string | number), T extends { [key: string]: R }>
  (myEnum: T, enumValue: ValueOf<T>): string {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : '';
}

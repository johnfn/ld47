export function Keys<T extends {}>(x: T): (keyof T)[] {
  const result = [];

  for (const foo in x) {
    if (x.hasOwnProperty(foo)) {
      result.push(foo);
    }
  }

  return result;
}

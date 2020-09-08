/*
** Get the first element of the array if we have an array.
** Otherwise return undefined.
**
** https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
*/
 function tryGetFirstElement<T>(arr?: T[]) {
  return arr?.[0];
  // equivalent to
  //   return (arr === null || arr === undefined) ?
  //       undefined :
  //       arr[0];
}

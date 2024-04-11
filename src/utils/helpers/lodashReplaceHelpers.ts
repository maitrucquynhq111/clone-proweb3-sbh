// const merge = (a, b) => ({ ...a, ...b });

// const times = (length) => Array(...Array(length));

// const isEmpty = (passedObj) =>
//   isArray(passedObj)
//     ? passedObj.length === 0
//     : !(
//         passedObj &&
//         passedObj === Object(passedObj) &&
//         Object.keys(passedObj).length !== 0
//       );

// const isFunction = (sample) => typeof sample === 'function';

// const noop = () => undefined;

// const memoize = (fn, resolver = null) => {
//   const cache = new Map();
//   // instead of returning the function right away, store it in a variable...
//   const memoized = function (...args) {
//     const key = resolver ? resolver.apply(...args) : args[0];
//     if (cache.has(key)) {
//       return cache.get(key);
//     } else {
//       const result = fn(...args);
//       cache.set(key, result);
//       return result;
//     }
//   };
//   // add a method to it to get the cache
//   memoized.getCache = () => cache;
//   // now return the function
//   return memoized;
// };

// const uniqueId = (function () {
//   let num = 0;

//   return function (prefix) {
//     prefix = String(prefix) || '';
//     num += 1;
//     return prefix + num;
//   };
// })();

// const get = (obj, path, defaultValue = undefined) => {
//   const travel = (regexp) =>
//     path
//       ? String.prototype.split
//           .call(path, regexp)
//           .filter(Boolean)
//           .reduce(
//             (res, key) => (res !== null && res !== undefined ? res[key] : res),
//             obj
//           )
//       : undefined;

//   const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
//   return result === undefined ? defaultValue : result;
// };

// const compact = (arr: Array<any>) => arr.filter(Boolean);

// const chunk = (input, size) =>
//   input.reduce(
//     (arr, item, idx) =>
//       idx % size === 0
//         ? [...arr, [item]]
//         : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]],
//     []
//   );

// const isUndefined = (a) => typeof a === 'undefined';

// const isNumber = (a) => typeof a === 'number';

// const isString = (str) => str && typeof str.valueOf() === 'string';

// const isNil = (a) => a == null;

// const isArray = (arr) => Array.isArray(arr);

// const split = (str, val, num = 0) => str.split(val, num);

// const trim = (str) => str.trim();

// const debounce = (func, wait, immediate = false) => {
//   let timeout;

//   /* eslint-disable  @typescript-eslint/no-this-alias */
//   /* eslint-disable  prefer-rest-params */
//   return function () {
//     const context = this,
//       args = arguments;
//     clearTimeout(timeout);
//     timeout = setTimeout(function () {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     }, wait);
//     if (immediate && !timeout) func.apply(context, args);
//   };
//   /* eslint-enable  prefer-rest-params */
//   /* eslint-enable  @typescript-eslint/no-this-alias */
// };

// const includes = (arr: Array<any>, val) => arr.includes(val);

// const pickBy = (object) => {
//   const obj = {};

//   for (const key in object) {
//     if (object[key]) {
//       obj[key] = object[key];
//     }
//   }

//   return obj;
// };

// const flattenDeep = (arr) =>
//   Array.isArray(arr)
//     ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
//     : [arr];

// const find = (
//   arr: Array<any>,
//   selector: (item: any, index: number) => boolean
// ) => arr.find(selector);

// const forEach = (
//   arr: readonly any[],
//   selector: (item: any, index: number) => void
// ) => {
//   arr.forEach(selector);
// };

// const assign = (a, b) => Object.assign(a, ...b);

// export {
//   merge,
//   times,
//   isEmpty,
//   isFunction,
//   noop,
//   memoize,
//   uniqueId,
//   get,
//   compact,
//   chunk,
//   isUndefined,
//   isNumber,
//   isString,
//   isNil,
//   isArray,
//   split,
//   trim,
//   debounce,
//   includes,
//   pickBy,
//   flattenDeep,
//   find,
//   forEach,
//   assign,
// };

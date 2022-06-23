// t是default,其他的包在物件裡
import t, { f, f3, b } from "./func02.js";

import t2, * as t3 from "./func02.js";

console.log(t);
console.log(f(7));
console.log(f3(4));
console.log(b);
// --------------
// *as t3 代表其他全部,t3的f3跟t3的b
console.log(t3.f3(4));
console.log(t3.b);

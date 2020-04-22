//@ runBigIntEnabled

function assert(input, expected) {
    if (input !== expected)
        throw new Error("Bad!");
}

assert(-1n + "", "-1");
assert("" + -1n, "-1");
assert(0n + "", "0");
assert("" + 0n, "0");
assert(1n + "", "1");
assert("" + 1n, "1");
assert(123456789000000000000000n + "", "123456789000000000000000");
assert("" + 123456789000000000000000n, "123456789000000000000000");
assert(-123456789000000000000000n + "", "-123456789000000000000000");
assert("" + -123456789000000000000000n, "-123456789000000000000000");

assert([] + -123456789000000000000000n, "-123456789000000000000000");
assert(-123456789000000000000000n + [], "-123456789000000000000000");

let a = {};
assert(a + 3n, "[object Object]3");
assert(3n + a, "3[object Object]");


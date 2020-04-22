let testCases = [
    // Numbers
    ['1', NaN, NaN, 2, 2],
    ['1.5', NaN, NaN, 1 + 1.5, 1 + 1.5],
    [NaN, NaN, NaN, NaN, NaN],

    // Strings.
    ['""', '"undefined"', '"undefined"', '"1"', '"1"'],
    ['new String()', '"undefined"', '"undefined"', '"1"', '"1"'],
    ['"WebKit!"', '"undefinedWebKit!"', '"WebKit!undefined"', '"1WebKit!"', '"WebKit!1"'],

    // Objects.
    ['{ }', '"undefined[object Object]"', '"[object Object]undefined"', '"1[object Object]"', '"[object Object]1"'],
    ['{ foo: 1 }', '"undefined[object Object]"', '"[object Object]undefined"', '"1[object Object]"', '"[object Object]1"'],
    ['{ toString: function() { return ""; } }', '"undefined"', '"undefined"', '"1"', '"1"'],
    ['{ toString: function() { return "WebKit"; } }', '"undefinedWebKit"', '"WebKitundefined"', '"1WebKit"', '"WebKit1"'],

    // Others.
    ['null', NaN, NaN, 1, 1],
    ['undefined', NaN, NaN, NaN, NaN]
];

for (let testCase of testCases) {
    let otherOperand = testCase[0];
    let expectedLeftValueWithHole = testCase[1];
    let expectedRightValueWithHole = testCase[2];
    let expectedLeftValue = testCase[3];
    let expectedRightValue = testCase[4];
    eval(
        `// Those holes are not observable by arithmetic operation.
        // The return value is always going to be NaN.
        function nonObservableHoleOnLhs(array, otherValue) {
            return array[0] + otherValue;
        }
        noInline(nonObservableHoleOnLhs);

        function observableHoleOnLhs(array, otherValue) {
            let value = array[0];
            return [value + otherValue, value];
        }
        noInline(observableHoleOnLhs);

        function nonObservableHoleOnRhs(array, otherValue) {
            return otherValue + array[0];
        }
        noInline(nonObservableHoleOnRhs);

        function observableHoleOnRhs(array, otherValue) {
            let value = array[0];
            return [otherValue + value, value];
        }
        noInline(observableHoleOnRhs);

        let testArray = new Array;
        for (let i = 1; i < 3; ++i) {
            testArray[i] = i + 0.5
        }

        let isEqual = function(a, b) {
            if (a === a) {
                return a === b;
            }
            return b !== b;
        }

        for (let i = 0; i < 1e4; ++i) {
            let lhsResult1 = nonObservableHoleOnLhs(testArray, ${otherOperand});
            if (!isEqual(lhsResult1, ${expectedLeftValueWithHole}))
                throw "Error on nonObservableHoleOnLhs at i = " + i + " with operand " + ${otherOperand} + " expected " + ${expectedLeftValueWithHole} + " got " + lhsResult1;
            let lhsResult2 = observableHoleOnLhs(testArray, ${otherOperand});
            if (!isEqual(lhsResult2[0], ${expectedLeftValueWithHole}) || lhsResult2[1] !== undefined)
                throw "Error on observableHoleOnLhs at i = " + i;

            let rhsResult1 = nonObservableHoleOnRhs(testArray, ${otherOperand});
            if (!isEqual(rhsResult1, ${expectedRightValueWithHole}))
                throw "Error on nonObservableHoleOnRhs at i = " + i + " with operand " + ${otherOperand} + " expected " + ${expectedRightValueWithHole} + " got " + rhsResult1;
            let rhsResult2 = observableHoleOnRhs(testArray, ${otherOperand});
            if (!isEqual(rhsResult2[0], ${expectedRightValueWithHole}) || rhsResult2[1] !== undefined)
                throw "Error on observableHoleOnRhs at i = " + i;
        }

        // Fill the hole, make sure everything still work correctly.
        testArray[0] = 1.;
        for (let i = 0; i < 1e4; ++i) {
            let lhsResult1 = nonObservableHoleOnLhs(testArray, ${otherOperand});
            if (!isEqual(lhsResult1, ${expectedLeftValue}))
                throw "Error on non hole nonObservableHoleOnLhs at i = " + i + " expected " + ${expectedLeftValue} + " got " + lhsResult1;
            let lhsResult2 = observableHoleOnLhs(testArray, ${otherOperand});
            if (!isEqual(lhsResult2[0], ${expectedLeftValue}) || lhsResult2[1] !== 1)
                throw "Error on non hole observableHoleOnLhs at i = " + i + " expected " + ${expectedLeftValue} + " got " + lhsResult2[0];

            let rhsResult1 = nonObservableHoleOnRhs(testArray, ${otherOperand});
            if (!isEqual(rhsResult1, ${expectedRightValue}))
                throw "Error on non hole nonObservableHoleOnRhs at i = " + i + " with operand " + ${otherOperand} + " expected " + ${expectedRightValue} + " got " + rhsResult1;
            let rhsResult2 = observableHoleOnRhs(testArray, ${otherOperand});
            if (!isEqual(rhsResult2[0], ${expectedRightValue}) || rhsResult2[1] !== 1)
                throw "Error on non hole observableHoleOnRhs at i = " + i;
        }`
    );
}
import ava from "ava";
import {
    fillChildGroup
} from "../../testUtil/stubFeature";

ava("selectLast does nothing if first element is selected", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = true;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.true(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.true(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
});

ava("selectLast does nothing if first element is undefined", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = undefined;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.true(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.true(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
});

ava("selectLast selects last if others are false", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        if (i !== 2)
            test.true(f.selectPositive.notCalled, i + " should not have been selected positive");
        else
            test.true(f.selectPositive.calledOnce, i + " should have been selected positive");

        test.true(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
});

ava("selectAllPositive selects all positive", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllPositive("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.true(f.selectPositive.calledOnce, i + " should have been selected positive");
        test.true(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
});

ava("selectAllNegative selects all negative", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllNegative("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.true(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.true(f.selectNegative.calledOnce, i + " should have been selected negative");
    });
});

ava("selectAllPositive skips caller", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllPositive("reason", undefined, uut.features[0]);

    test.true(uut.features[0].selectNegative.notCalled);
});

ava("selectAllNegative skips caller", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllNegative("reason", undefined, uut.features[1]);

    test.true(uut.features[1].selectNegative.notCalled);
});
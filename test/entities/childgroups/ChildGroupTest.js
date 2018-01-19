import tape from "tape";
import {
    fillChildGroup
} from "../../testUtil/stubFeature";

tape("selectLast does nothing if first element is selected", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = true;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.ok(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.ok(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
    test.end();
});

tape("selectLast does nothing if first element is undefined", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = undefined;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.ok(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.ok(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
    test.end();
});

tape("selectLast selects last if others are false", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    uut.selectLast("reason", undefined, true);

    uut.features.forEach((f, i) => {
        if (i !== 2)
            test.ok(f.selectPositive.notCalled, i + " should not have been selected positive");
        else
            test.ok(f.selectPositive.calledOnce, i + " should have been selected positive");

        test.ok(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
    test.end();
});

tape("selectAllPositive selects all positive", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllPositive("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.ok(f.selectPositive.calledOnce, i + " should have been selected positive");
        test.ok(f.selectNegative.notCalled, i + " should not have been selected negative");
    });
    test.end();
});

tape("selectAllNegative selects all negative", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllNegative("reason", undefined, true);

    uut.features.forEach((f, i) => {
        test.ok(f.selectPositive.notCalled, i + " should not have been selected positive");
        test.ok(f.selectNegative.calledOnce, i + " should have been selected negative");
    });
    test.end();
});

tape("selectAllPositive skips caller", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllPositive("reason", undefined, uut.features[0]);

    test.ok(uut.features[0].selectNegative.notCalled);
    test.end();
});

tape("selectAllNegative skips caller", function (test) {
    var uut = fillChildGroup(3);
    uut.features[0].selection = false;
    uut.features[1].selection = true;
    uut.features[2].selection = undefined;

    uut.selectAllNegative("reason", undefined, uut.features[1]);

    test.ok(uut.features[1].selectNegative.notCalled);
    test.end();
});
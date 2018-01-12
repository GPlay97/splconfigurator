import tape from "tape";
import Feature from "../../src/entities/Feature";
import FeatureError from "../../src/entities/FeatureError";

tape("selectPositive positively selects feature itself", function (test) {
    var uut = new Feature("test");

    var result = uut.selectPositive();

    test.isNot(result instanceof FeatureError);
    test.equals(uut.selection, true);
    test.end();
});

tape("selectPositive positively selects required feature", function (test) {
    var uut1 = new Feature("requirer");
    var uut2 = new Feature("requiree");

    uut1.require.push(uut2);
    uut2.reverseRequire.push(uut1);

    var result = uut1.selectPositive();

    test.isNot(result instanceof FeatureError);
    test.equals(uut1.selection, true);
    test.equals(uut2.selection, true);
    test.end();
});

tape("selectNegative negatively selects feature itself", function (test) {
    var uut = new Feature("test");

    var result = uut.selectNegative();

    test.isNot(result instanceof FeatureError);
    test.equals(uut.selection, false);
    test.end();
});

tape("selectNegative negatively selects reverseRequired feature", function (test) {
    var uut1 = new Feature("requirer");
    var uut2 = new Feature("requiree");

    uut1.require.push(uut2);
    uut2.reverseRequire.push(uut1);

    var result = uut2.selectNegative();

    test.isNot(result instanceof FeatureError);
    test.equals(uut1.selection, false);
    test.equals(uut2.selection, false);
    test.end();
});
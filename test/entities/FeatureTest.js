import ava from "ava";
import Feature from "../../src/entities/Feature";
import FeatureError from "../../src/entities/FeatureError";

ava("selectPositive positively selects feature itself", function (test) {
    var uut = new Feature("test");

    var result = uut.selectPositive();

    test.not(result instanceof FeatureError);
    test.is(uut.selection, true);
});

ava("selectNegative negatively selects feature itself", function (test) {
    var uut = new Feature("test");

    var result = uut.selectNegative();

    test.not(result instanceof FeatureError);
    test.is(uut.selection, false);
});
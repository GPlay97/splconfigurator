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

tape("selectNegative negatively selects feature itself", function (test) {
    var uut = new Feature("test");

    var result = uut.selectNegative();

    test.isNot(result instanceof FeatureError);
    test.equals(uut.selection, false);
    test.end();
});
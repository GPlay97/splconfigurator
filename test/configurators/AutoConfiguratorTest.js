import tape from "tape";
import Model from "../../src/model/Model";
import AutoConfigurator from "../../src/configurators/AutoConfigurator";
import {
    loadModel,
    getConfigFromModel
} from "../testUtil/serializationHelper";

import complex1 from "../resources/complex1.json";
import complex1Positive from "../resources/complex1Positive.json";
import complex1Negative from "../resources/complex1Negative.json";
import trap from "../resources/trap.json";
import trapSolution from "../resources/trapSolution.json";
import impossible from "../resources/impossible.json";

tape("AutoConfigurator selects root positive with positive preference", test => {
    var model = new Model("core");
    var uut = new AutoConfigurator(model, true);

    var result = uut.solve();

    test.ok(result);
    test.equals(model.selectionOf("core"), true, "root should be selected positive");
    test.end();
});

tape("AutoConfigurator selects root positive with negative preference", test => {
    var model = new Model("core");
    var uut = new AutoConfigurator(model, false);

    var result = uut.solve();

    test.ok(result);
    test.equals(model.selectionOf("core"), true, "root should be selected positive");
    test.end();
});

tape("AutoConfigurator solves complex1 positive", test => {
    var model = loadModel(complex1);
    var uut = new AutoConfigurator(model, true);

    var result = uut.solve();

    test.ok(result);
    test.deepEquals(getConfigFromModel(model), complex1Positive, "selections should be equivalent");
    test.end();
});

tape("AutoConfigurator solves complex1 negative", test => {
    var model = loadModel(complex1);
    var uut = new AutoConfigurator(model, false);

    var result = uut.solve();

    test.ok(result);
    test.deepEquals(getConfigFromModel(model), complex1Negative, "selections should be equivalent");
    test.end();
});

tape("AutoConfigurator solves trap positive", test => {
    var model = loadModel(trap);
    var uut = new AutoConfigurator(model, true);

    var result = uut.solve();

    test.ok(result);
    test.deepEquals(getConfigFromModel(model), trapSolution, "selections should be equivalent");
    test.end();
});

tape("AutoConfigurator solves trap negative", test => {
    var model = loadModel(trap);
    var uut = new AutoConfigurator(model, false);

    var result = uut.solve();

    test.ok(result);
    test.deepEquals(getConfigFromModel(model), trapSolution, "selections should be equivalent");
    test.end();
});

tape("AutoConfigurator fails impossible positive", test => {
    var model = loadModel(impossible);
    var uut = new AutoConfigurator(model, true);

    var result = uut.solve();

    test.notok(result);
    test.equals(model.selectionOf("impossible"), undefined, "root should not be selected");
    test.end();
});

tape("AutoConfigurator fails impossible negative", test => {
    var model = loadModel(impossible);
    var uut = new AutoConfigurator(model, false);

    var result = uut.solve();

    test.notok(result);
    test.equals(model.selectionOf("impossible"), undefined, "root should not be selected");
    test.end();
});

tape("AutoConfigurator respects featurelist", test => {
    var model = loadModel(complex1);
    var uut = new AutoConfigurator(model, true);

    var result = uut.solve(["optional2", ]);

    test.ok(result);
    test.deepEquals(getConfigFromModel(model), {
        core: true,
        exclusive1: undefined,
        exclusive2: undefined,
        exclusive3: undefined,
        nested1: undefined,
        nested2: undefined,
        nestedMandatory: true,
        mandatory1: true,
        mandatory2: true,
        mandatory3: true,
        optional1: undefined,
        optional2: true,
        optional3: false,
        or1: undefined,
        or2: undefined,
        or3: undefined,
    }, "selections should be equivalent");
    test.end();
});
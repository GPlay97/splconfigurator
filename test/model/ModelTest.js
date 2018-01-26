import ava from "ava";
import Model from "../../src/model/Model";

ava("new model creates and registers root feature", test => {
    var uut = new Model("core");

    var root = uut.root;

    test.truthy(root);
    test.is(uut.features[0], root);
    test.is(uut.nameMap.core, root);
});

ava("valid features can be added", test => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");

    test.truthy(feature);
    test.is(feature.name, "child");
    test.true(uut.features.indexOf(feature) >= 0);
    test.is(uut.nameMap.child, feature);
});

ava("features with duplicate names can not be added", test => {
    var uut = new Model("core");
    test.throws(() => uut.addFeature("core", "core", "optional"));

    test.is(uut.features.length, 1);
    test.is(uut.nameMap.core, uut.root);
});
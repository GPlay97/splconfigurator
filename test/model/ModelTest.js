import tape from "tape";
import Model from "../../src/model/Model";

tape("new model creates and registers root feature", test => {
    var uut = new Model("core");

    var root = uut.root;

    test.ok(root);
    test.same(uut.features[0], root);
    test.same(uut.nameMap.core, root);
    test.end();
});

tape("valid features can be added", test => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");

    test.ok(feature);
    test.equals(feature.name, "child");
    test.ok(uut.features.indexOf(feature) >= 0);
    test.same(uut.nameMap.child, feature);
    test.end();
});

tape("features with duplicate names can not be added", test => {
    var uut = new Model("core");
    test.throws(() => uut.addFeature("core", "core", "optional"));

    test.ok(uut.features.length, 1);
    test.same(uut.nameMap.core, uut.root);
    test.end();
});
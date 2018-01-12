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
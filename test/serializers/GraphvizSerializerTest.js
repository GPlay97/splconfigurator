import ava from "ava";
import GraphvizSerializer from "../../src/serializers/GraphvizSerializer";
import Model from "../../src/model/Model";

ava("GraphvizSerializer serializes root", test => {
    var model = new Model("core");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, "digraph G {\r\ncore\r\n}");
});

ava("GraphvizSerializer serializes optional children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addFeature("core", "child2", "optional");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowhead="odot"]\r\ncore->child2[arrowhead="odot"]\r\n}');
});

ava("GraphvizSerializer serializes mandatory children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "mandatory");
    model.addFeature("core", "child2", "mandatory");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowhead="dot"]\r\ncore->child2[arrowhead="dot"]\r\n}');
});

ava("GraphvizSerializer serializes exclusive children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "exclusive");
    model.addFeature("core", "child2", "exclusive");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowtail="odiamond";dir="back"]\r\ncore->child2[arrowtail="odiamond";dir="back"]\r\n}');
});

ava("GraphvizSerializer serializes require edges", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addRequire("core", "child1");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\ncore->child1[label="<<require>>";style="dashed"]\r\ncore->child1[arrowhead="odot"]\r\n}');
});

ava("GraphvizSerializer serializes exclude edges", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addExclude("core", "child1");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\ncore->child1[label="<<exclude>>";style="dashed";arrowtail="normal";dir="both"]\r\ncore->child1[arrowhead="odot"]\r\n}');
});

ava("GraphvizSerializer serializes nested children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addFeature("child1", "child2", "optional");
    model.addFeature("child2", "child3", "optional");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.is(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\nchild3\r\ncore->child1[arrowhead="odot"]\r\nchild1->child2[arrowhead="odot"]\r\nchild2->child3[arrowhead="odot"]\r\n}');
});

ava("GraphvizSerializer serializes selected elements in config", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addFeature("core", "child2", "optional");
    model.selectFeatureNegative("child2");
    var uut = new GraphvizSerializer();

    var result = model.serializeConfiguration(uut);

    test.is(result, 'digraph G {\r\ncore[color="green";fontcolor="green"]\r\nchild1\r\nchild2[color="red";fontcolor="red"]\r\ncore->child1[arrowhead="odot"]\r\ncore->child2[arrowhead="odot"]\r\n}');
});
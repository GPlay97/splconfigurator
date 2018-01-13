import Model from "../src/model/Model";
import JSONSerializer from "../src/model/JSONSerializer";

var model = new Model("core");
model.addFeature("core", "child1", "or");
model.addFeature("core", "child2", "or");
model.addFeature("core", "child3", "or");
model.addRequire("child1", "child2");
model.addExclude("child2", "child3");

var serializer = new JSONSerializer();
console.log(serializer);

var ser = model.serializeModel(serializer);
console.log(JSON.stringify(ser));
var m2 = serializer.deserializeModel(ser);
console.log(JSON.stringify(m2.serializeModel(serializer)));

console.log(model.selectFeaturePositive("core"));
console.log(model.selectFeatureNegative("child1"));
console.log(model.selectFeatureNegative("child3"));

var config = model.serializeConfiguration(serializer);
console.log(JSON.stringify(config));
console.log(m2.deserializeConfiguration(serializer, config));
console.log(JSON.stringify(m2.serializeConfiguration(serializer, config)));
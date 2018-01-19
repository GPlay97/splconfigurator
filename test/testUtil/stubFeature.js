import sinon from "sinon";
import Feature from "../../src/entities/Feature";
import ChildGroup from "../../src/entities/childGroups/ChildGroup";

export function stubFeature(name, selection) {
    var feature = new Feature(name);
    sinon.stub(feature, "selectPositive");
    sinon.stub(feature, "selectNegative");
    feature.selection = selection;
    return feature;
}

export function fillChildGroup(size, group) {
    if (!group) {
        group = new ChildGroup();
    }
    for (var i = 0; i < size; i++) {
        group.features.push(stubFeature());
    }
    return group;
}
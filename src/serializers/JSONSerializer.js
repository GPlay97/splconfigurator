import Serializer from "./Serializer";
import Model from "./Model";

function serializeModel(feature) {
    var crossTreeConstraints = [];
    var tree = serializeFeature(feature, crossTreeConstraints);
    return {
        "tree": tree,
        "crossTreeConstraints": crossTreeConstraints,
    };
}

function serializeFeature(feature, crossTreeConstraints) {
    var result = {
        "name": feature.name,
    };
    result.children = feature.children.map(cg => {
        return {
            "type": cg.type,
            "features": cg.features.map(f => serializeFeature(f, crossTreeConstraints)),
        };
    });
    feature.crossTreeConstraints.forEach(c => {
        if (c.features[0] === feature) {
            crossTreeConstraints.push({
                "type": c.type,
                "features": c.features.map(f => f.name),
            });
        }
    });
    return result;
}

function deserializeModel(json) {
    var model = deserializeFeature(json.tree);
    json.crossTreeConstraints.forEach(ctc => model.addCrossTreeConstraint(ctc.type, ctc.features));
    return model;
}

function deserializeFeature(json, model, parent, childType) {
    if (model) {
        model.addFeature(parent, json.name, childType, json.implicit);
    } else {
        model = new Model(json.name);
    }
    if (json.children) {
        json.children.forEach(cg => {
            cg.features.forEach(f => model.addFeature(json.name, f.name, cg.type));
        });
    }
    return model;
}

function serializeConfiguration(feature, currentConfig) {
    currentConfig = currentConfig || {};
    currentConfig[feature.name] = feature.selection;
    feature.children.forEach(cg => cg.features.forEach(f => serializeConfiguration(f, currentConfig)));
    return currentConfig;
}

function deserializeConfiguration(model, json) {
    var stacks = [];
    for (var key in json) {
        if (!json.hasOwnProperty(key)) continue;
        if (json[key]) {
            stacks.push(model.selectFeaturePositive(key));
        } else {
            stacks.push(model.selectFeatureNegative(key));
        }
    }
    return stacks;
}

export default function JSONSerializer() {
    return new Serializer(serializeModel, deserializeModel, serializeConfiguration, deserializeConfiguration);
}
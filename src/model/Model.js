import Feature from "../entities/Feature";
import ChildGroup from "../entities/ChildGroup";
import FeatureError from "../entities/FeatureError";

var groupTypes = ["required", "optional", "or", "exclusive"];

export default function Model(rootName) {
    var root = new Feature(rootName);
    var nameMap = {};
    var features = [root];
    var selectionStarted = false;

    nameMap[rootName] = root;

    //? if(EXPOSE_INNERTS) {
    this.nameMap = nameMap;
    this.features = features;
    this.root = root;
    //? }

    this.selectionStarted = function () {
        return selectionStarted;
    };

    this.addFeature = function (parentName, childName, groupType) {
        if (selectionStarted) {
            throw "modifications after starting the feature selection are not allowed";
        }

        var parent = nameMap[parentName];
        if (!parent) {
            throw "unable to add feature " + childName + ": unknown parent " + parentName;
        }
        if (nameMap[childName]) {
            throw "unable to add feature " + childName + ": feature with this name already exists";
        }
        if (!groupTypes.find(groupType)) {
            throw "unable to add feature " + childName + ": unknown groupType " + groupType;
        }
        var group = parent.children.find(cg => cg.type === groupType);
        if (!group) {
            group = new ChildGroup(groupType);
            parent.children.push(group);
        }
        var child = new Feature(childName, undefined, undefined, undefined, parent, group);

        nameMap[childName] = child;
        group.features.push(child);
        features.push(child);

        //? if(EXPOSE_INNERTS) {
        return child;
        //? }
    };

    this.addExclude = function (feature1Name, feature2Name) {
        if (selectionStarted) {
            throw "modifications after starting the feature selection are not allowed";
        }

        var feature1 = nameMap[feature1Name];
        if (!feature1) {
            throw "unable to add exclude constraint: unknown feature " + feature1Name;
        }
        var feature2 = nameMap[feature2Name];
        if (!feature2) {
            throw "unable to add exclude constraint: unknown feature " + feature2Name;
        }

        feature1.exclude.push(feature2);
        feature2.exclude.push(feature1);
    };

    this.addRequire = function (feature1Name, feature2Name) {
        if (selectionStarted) {
            throw "modifications after starting the feature selection are not allowed";
        }

        var feature1 = nameMap[feature1Name];
        if (!feature1) {
            throw "unable to add require constraint: unknown feature " + feature1Name;
        }
        var feature2 = nameMap[feature2Name];
        if (!feature2) {
            throw "unable to add require constraint: unknown feature " + feature2Name;
        }

        feature1.require.push(feature2);
        feature2.reverseRequire.push(feature1);
    };

    this.selectFeaturePositive = function (featureName) {
        var feature = nameMap[featureName];
        if (!feature) {
            throw "unable to select feature: unknown feature " + featureName;
        }

        var result = feature.selectPositive("user selected");
        if (result instanceof FeatureError) {
            throw "selection of feature failed: " + result.reason + ": " + feature.name;
        }
    };

    this.selectFeaturePositive = function (featureName) {
        var feature = nameMap[featureName];
        if (!feature) {
            throw "unable to select feature: unknown feature " + featureName;
        }

        var result = feature.selectNegative("user selected");
        if (result instanceof FeatureError) {
            throw "selection of feature failed: " + result.reason + ": " + feature.name;
        }

        //? if(EXPOSE_INNERTS) {
        return result;
        //? }
    };

}
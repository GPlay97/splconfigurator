import Feature from "../entities/Feature";
import FeatureError from "../entities/FeatureError";
import MandatoryChildGroup from "../entities/childGroups/MandatoryChildGroup";
import OptionalChildGroup from "../entities/childGroups/OptionalChildGroup";
import OrChildGroup from "../entities/childGroups/OrChildGroup";
import ExclusiveChildGroup from "../entities/childGroups/ExclusiveChildGroup";
import ExcludeConstraint from "../entities/crossTreeConstraints/ExcludeConstraint";
import RequireConstraint from "../entities/crossTreeConstraints/RequireConstraint";

var groupTypes = {
    "mandatory": MandatoryChildGroup,
    "optional": OptionalChildGroup,
    "or": OrChildGroup,
    "exclusive": ExclusiveChildGroup,
};

export default function Model(rootName) {
    var root = new Feature(rootName);
    var nameMap = {};
    var features = [root, ];
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
        if (!groupTypes[groupType]) {
            throw "unable to add feature " + childName + ": unknown groupType " + groupType;
        }
        var group = parent.children.find(cg => cg.type === groupType);
        if (!group) {
            group = new groupTypes[groupType](parent);
            parent.children.push(group);
        }
        var child = new Feature(childName, parent, group);

        nameMap[childName] = child;
        group.features.push(child);
        features.push(child);

        //? if(RETURN_INNERTS) {
        return child;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.addCrossTreeConstraint = function (type, features) {
        switch (type) {
            case "exclude":
                return this.addExclude(features[0], features[1]);
            case "require":
                return this.addRequire(features[0], features[1]);
            default:
                throw "unable to add constraint of unknown type " + type;
        }
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
        var constraint = new ExcludeConstraint(feature1, feature2);
        feature1.crossTreeConstraints.push(constraint);
        feature2.crossTreeConstraints.push(constraint);

        //? if(RETURN_INNERTS) {
        return constraint;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
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

        var constraint = new RequireConstraint(feature1, feature2);
        feature1.crossTreeConstraints.push(constraint);
        feature2.crossTreeConstraints.push(constraint);

        //? if(RETURN_INNERTS) {
        return constraint;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.selectFeaturePositive = function (featureName) {
        return selectFeature(featureName, "Positive");
    };

    this.selectFeatureNegative = function (featureName) {
        return selectFeature(featureName, "Negative");
    };

    function selectFeature(featureName, type) {
        var feature = nameMap[featureName];
        if (!feature) {
            throw "unable to select feature: unknown feature " + featureName;
        }
        try {
            var result = feature["select" + type]("user selected");
            //? if(RETURN_INNERTS) {
            return result;
            //? }

            //? if(RETURN_SELF) {
            // eslint-disable-next-line no-unreachable
            return this;
            //? }
        } catch (e) {
            if (e instanceof FeatureError) {
                //? if (FORCE_VALID) {
                e.stack.revert();
                //? }

                //? if (RETURN_INNERTS) {
                throw e;
                //? } else {
                // eslint-disable-next-line no-unreachable
                throw "selection of feature failed: " + e.reason + ": " + e.name;
                //? }
            } else {
                throw e;
            }
        }
    }

    this.serializeModel = function (serializer) {
        return serializer.serializeModel(root);
    };

    this.serializeConfiguration = function (serializer) {
        return serializer.serializeConfiguration(root);
    };

    this.deserializeConfiguration = function (serializer, configuration) {
        return serializer.deserializeConfiguration(this, configuration);
    };
}
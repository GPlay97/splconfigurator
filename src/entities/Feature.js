import FeatureError from "./FeatureError";
import FeatureSelectionStack from "./FeatureSelectionStack";
import forEachUntilFailure from "../util/forEachUntilFailure";

export default function Feature(name, require, reverseRequire, exclude, parent, childGroup) {
    this.name = name;
    this.parent = parent;
    this.childGroup = childGroup;
    this.children = [];
    this.selection;
    this.exclude = exclude || [];
    this.require = require || [];
    this.reverseRequire = reverseRequire || [];
}

Feature.prototype.resolveEdges = function (featureNameMap) {
    this.exclude = this.exclude.map(name => typeof name === "string" ? featureNameMap[name] : name);
    this.require = this.require.map(name => {
        if (typeof name === "string") {
            featureNameMap[name].reverseRequire.push(this);
            return featureNameMap[name];
        }
        return name;
    });
    return this;
};

Feature.prototype.selectPositive = function (reason, callStack, invoker) {
    var result;
    if (this.selection === true)
        return;

    if (!callStack) callStack = new FeatureSelectionStack();
    callStack.push(this, "+", reason, invoker);

    if (this.selection === false)
        return new FeatureError("invalid positive selection", this, callStack);

    this.selection = true;
    if (this.parent) {
        result = this.parent.selectPositive("child selected", this);
        if (result instanceof FeatureError) return result;
    }
    result = forEachUntilFailure(this.require, e => e.selectPositive("required", callStack, this));
    if (result instanceof FeatureError) return result;
    result = forEachUntilFailure(this.exclude, e => e.selectNegative("excluded", callStack, this));
    if (result instanceof FeatureError) return result;

    result = forEachUntilFailure(this.children, cg => {
        if (cg.type === "mandatory") {
            return cg.selectAllPositive("parent selected", callStack, this);
        } else if (cg.type === "alternative") {
            return cg.selectLast(callStack, this);
        } else if (this.children.type === "or") {
            return cg.selectLast(callStack, this);
        }
    });
    if (result instanceof FeatureError) return result;

    if (this.siblings) {
        if (this.siblings.type === "alternative") {
            result = this.siblings.selectAllNegative("other alternative selected", callStack, this);
            if (result instanceof FeatureError) return result;
        }
    }
    return callStack;
};

Feature.prototype.selectNegative = function (reason, callStack, invoker) {
    var result;
    if (this.selection === false)
        return;
    if (this.selection === true)
        return new FeatureError("invalid negative selection", this, callStack);

    if (!callStack) callStack = new FeatureSelectionStack();
    callStack.push(this, "+", reason, invoker);

    this.selection = false;
    result = forEachUntilFailure(this.children, cg => cg.selectAllNegative("parent deselected", callStack, this));
    if (result instanceof FeatureError) return result;
    if (this.childGroup) {
        if (this.childGroup.type === "mandatory") {
            result = this.parents.deselect("mandatory child deselected", callStack, this);
            if (result instanceof FeatureError) return result;
        } else if (this.childGroup.type === "alternative") {
            result = this.childGroup.selectLast(callStack, this);
            if (result instanceof FeatureError) return result;
        } else if (this.childGroup.type === "or") {
            result = this.childGroup.selectLast(callStack, this);
            if (result instanceof FeatureError) return result;
        }
    }

    forEachUntilFailure(this.reverseRequire, e => e.selectNegative("require deselected", callStack, this));
    return this;
};
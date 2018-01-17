import FeatureError from "./FeatureError";
import FeatureSelectionStack from "./FeatureSelectionStack";

export default function Feature(name, parent, childGroup) {
    this.name = name;
    this.parent = parent;
    this.childGroup = childGroup;
    this.children = [];
    this.selection;
    this.crossTreeConstraints = [];
}

Feature.prototype.selectPositive = function (reason, callStack, invoker) {
    if (!callStack) callStack = new FeatureSelectionStack();
    if (this.selection === true)
        return callStack;
    if (this.selection === false)
        throw new FeatureError("invalid positive selection", this, reason, callStack);
    callStack.push(this, this.selection, true, reason, invoker);

    this.selection = true;

    if (this.parent) {
        this.parent.selectPositive("child selected", callStack, this);
    }
    if (this.childGroup)
        this.childGroup.onPositiveSelection(this, callStack);

    this.children.forEach(cg => cg.onParentPositiveSelection(this, callStack));

    this.crossTreeConstraints.forEach(c => c.onPositiveSelection(this, callStack));

    return callStack;
};

Feature.prototype.selectNegative = function (reason, callStack, invoker) {
    if (!callStack) callStack = new FeatureSelectionStack();
    if (this.selection === false)
        return callStack;
    if (this.selection === true)
        throw new FeatureError("invalid negative selection", this, reason, callStack);
    callStack.push(this, this.selection, false, reason, invoker);

    this.selection = false;

    if (this.childGroup)
        this.childGroup.onNegativeSelection(this, callStack);

    this.children.forEach(cg => cg.selectAllNegative(this, callStack));

    this.crossTreeConstraints.forEach(c => c.onNegativeSelection(this, callStack));

    return callStack;
};
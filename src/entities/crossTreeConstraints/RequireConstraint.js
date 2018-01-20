import CrossTreeConstraint from "./CrossTreeConstraint";

function onPositiveSelection(feature, callStack) {
    if (feature === this.features[0]) {
        this.features[1].selectPositive("required", callStack, feature);
    }
}

function onNegativeSelection(feature, callStack) {
    if (feature === this.features[1]) {
        this.features[0].selectNegative("requirement deselected", callStack, feature);
    }
}

export default function RequireConstraint(source, target) {

    return new CrossTreeConstraint("require", [source, target,], onPositiveSelection, onNegativeSelection);
}
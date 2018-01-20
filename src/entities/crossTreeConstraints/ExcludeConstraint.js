import CrossTreeConstraint from "./CrossTreeConstraint";

function onNegativeSelection() {}

function onPositiveSelection(feature, callStack) {
    this.features.forEach(f => {
        if (f !== feature) f.selectNegative("excluded", callStack, feature);
    });
}

export default function ExcludeConstraint(feature1, feature2) {
    return new CrossTreeConstraint("exclude", [feature1, feature2,], onPositiveSelection, onNegativeSelection);
}
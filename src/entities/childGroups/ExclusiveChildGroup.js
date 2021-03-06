import ChildGroup from "./ChildGroup";

function onParentPositiveSelection(feature, callStack) {
    this.selectLast("last child in exclusive group", callStack, feature);
}

function onPositiveSelection(feature, callStack) {
    this.selectAllNegative("other feature in exclusive group selected", callStack, feature);
}

function onNegativeSelection(feature, callStack) {
    if (this.parent.selection === true) {
        this.selectLast("last child in exclusive group", callStack, feature);
    } else if (this.features.reduce((acc, f) => acc && (f.selection === false), true)) {
        this.parent.selectNegative("exclusive child group completely deselected", callStack, feature);
    }
}

export default function ExclusiveChildGroup(parent) {
    return new ChildGroup("exclusive", parent, onParentPositiveSelection, onPositiveSelection, onNegativeSelection);
}
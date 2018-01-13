import ChildGroup from "./ChildGroup";

function onParentPositiveSelection(feature, callStack) {
    this.selectLast("last child in or group", callStack, feature);
}

function onPositiveSelection() {}

function onNegativeSelection(feature, callStack) {
    if (this.parent.selection === true) {
        this.selectLast("last child in or group", callStack, feature);
    } else if (!this.features.reduce((acc, f) => acc || f.selection !== false, false)) {
        this.parent.selectNegative("or child group completely deselected", callStack, feature);
    }
}

export default function OrChildGroup(parent) {
    return new ChildGroup("or", parent, onParentPositiveSelection, onPositiveSelection, onNegativeSelection);
}
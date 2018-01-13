import ChildGroup from "./ChildGroup";

function onParentPositiveSelection(feature, callStack) {
    this.selectAllPositive("parent selected", callStack, feature);
}

function onPositiveSelection() {

}

function onNegativeSelection(feature, callStack) {
    this.parent.selectNegative("mandatory child deselected", callStack, feature);
}

export default function MandatoryChildGroup(parent) {
    return new ChildGroup("mandatory", parent, onParentPositiveSelection, onPositiveSelection, onNegativeSelection);
}
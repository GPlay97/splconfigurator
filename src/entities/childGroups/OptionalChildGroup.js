import ChildGroup from "./ChildGroup";

function onParentPositiveSelection() {}

function onPositiveSelection() {}

function onNegativeSelection() {}

export default function OptionalChildGroup(parent) {
    return new ChildGroup("optional", parent, onParentPositiveSelection, onPositiveSelection, onNegativeSelection);
}
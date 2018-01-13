export default function ChildGroup(type, parent, onParentPositiveSelection, onPositiveSelection, onNegativeSelection) {
    this.type = type;
    this.parent = parent;
    this.onParentPositiveSelection = onParentPositiveSelection;
    this.onPositiveSelection = onPositiveSelection;
    this.onNegativeSelection = onNegativeSelection;
    this.features = [];
}

ChildGroup.prototype.selectLast = function (reason, callStack, invoker) {
    var unselected = this.features.length;
    this.features.reduce((acc, feature) => {
        if (acc) return acc;
        if (feature.selected === true) {
            return invoker;
        } else {
            if (--unselected === 1) {
                return feature.selectPositive(reason, callStack, invoker);
            }
        }
    }, false);
};

ChildGroup.prototype.selectAllPositive = function (reason, callStack, invoker) {
    this.features.forEach(f => f.selectPositive(reason, callStack, invoker));
};

ChildGroup.prototype.selectAllNegative = function (reason, callStack, invoker) {
    this.features.forEach(f => f.selectNegative(reason, callStack, invoker));
};
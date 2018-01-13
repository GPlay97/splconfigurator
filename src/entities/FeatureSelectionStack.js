export default function FeatureSelectionStack() {
    this.stack = [];
}

FeatureSelectionStack.prototype.push = function (feature, previous, now, reason, invoker) {
    this.stack.push({
        "feature": feature,
        "previous": previous,
        "now": now,
        "reason": reason,
        "invoker": invoker,
    });
};

FeatureSelectionStack.prototype.revert = function () {
    for (var i = this.stack.length - 1; i >= 0; i--) {
        this.stack[i].feature.selection = this.stack[i].previous;
    }
};
export default function FeatureSelectionStack() {
    this.stack = [];

    this.push = function (feature, type, reason, invoker) {
        this.stack.push({
            "feature": feature,
            "type": type,
            "reason": reason,
            "invoker": invoker
        });
    };
}
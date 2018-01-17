export default function FeatureError(reason, feature, selectionReason, stack) {
    this.reason = reason;
    this.feature = feature;
    this.stack = stack;
    this.selectionReason = selectionReason;
}
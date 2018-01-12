export default function FeatureError(reason, feature, stack) {
    this.reason = reason;
    this.feature = feature;
    this.stack = stack;
}
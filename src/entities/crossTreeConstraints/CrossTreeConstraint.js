export default function CrossTreeConstraint(type, features, onPositiveSelection, onNegativeSelection) {
    this.type = type;
    this.features = features;
    this.onPositiveSelection = onPositiveSelection;
    this.onNegativeSelection = onNegativeSelection;
}
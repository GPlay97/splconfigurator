function solve(model, featurenames, index, preference) {
    if (index >= featurenames.length) return true;
    var name = featurenames[index];
    if (typeof model.selectionOf(name) !== "undefined") return solve(model, featurenames, index + 1, preference);
    var result = trySolve(model, featurenames, index, preference);
    if (result) return true;
    return trySolve(model, featurenames, index, !preference);
}

function trySolve(model, featurenames, index, value) {
    try {
        model.selectFeature(featurenames[index], preference);
        if (!solve(model, featurenames, index + 1, preference)) {
            model.revertLastSelection();
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

export default function AutoConfigurator(model, preference) {
    this.solve = (featurenames) => solve(model, featurenames || model.featurenames, 0);
}
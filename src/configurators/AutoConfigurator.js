function solve(model, featurenames, index, preference) {
    var initial = model.selectionStarted;
    if (initial) {
        try {
            model.startSelection();
        } catch (e) {
            return false;
        }
    }
    if (index >= featurenames.length) return true;
    var name = featurenames[index];
    if (typeof model.selectionOf(name) !== "undefined") return solve(model, featurenames, index + 1, preference);
    var result = trySolve(model, featurenames, index, preference);
    if (result) return true;
    result = trySolve(model, featurenames, index, !preference);
    if (!result && initial) {
        model.revertLastSelection();
    }
    return result;
}

function trySolve(model, featurenames, index, value) {
    try {
        model.selectFeature(featurenames[index], value);
        if (!solve(model, featurenames, index + 1, value)) {
            model.revertLastSelection();
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

export default function AutoConfigurator(model, preference) {
    this.solve = (featurenames) => solve(model, featurenames || model.getFeaturenames(), 0, preference);
}
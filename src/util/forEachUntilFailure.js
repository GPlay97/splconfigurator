import FeatureError from "../entities/FeatureError";

export default function forEachUntilFailure(array, operation) {
    array.reduce((acc, element) => {
        if (acc && acc instanceof FeatureError) return acc;
        return operation(element, acc);
    }, true);
}
import FeatureError from "./FeatureError";

export default function ChildGroup(type) {
    this.type = type;
    this.features = [];

    this.selectLast = function (callStack, invoker) {
        var unselected = this.features.length;
        this.features.reduce((acc, feature) => {
            if (acc) return acc;
            if (feature.selected === true) {
                return invoker;
            } else {
                if (--unselected === 0) {
                    return feature.selectPositive("last feature in group", callStack, invoker);
                }
            }
        });
    };

    this.selectAllPositive = function (reason, callStack, invoker) {
        this.features.reduce((acc, feature) => {
            if (acc && acc instanceof FeatureError) return acc;
            if (feature !== invoker) return feature.selectPositive(reason, callStack, invoker);
            return acc;
        });
    };

    this.selectAllNegative = function (reason, callStack, invoker) {
        this.features.reduce((acc, feature) => {
            if (acc && acc instanceof FeatureError) return acc;
            if (feature !== invoker) return feature.selectNegative(reason, callStack, invoker);
            return acc;
        });
    };
}
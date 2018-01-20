import FeatureSelectionStack from "../entities/FeatureSelectionStack";

export default function Configurator(model, featurenames, getConfiguration, invalidBehavior) {
    this.start = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            function innerResolve(data) {
                if (!data.completed && !data.cancelled) {
                    return self.next(data.index, innerResolve, reject);
                }
                resolve(data);
            }
            self.next(-1, innerResolve, reject);
        });
    };

    this.next = function (index, resolve, reject) {
        if (!resolve) {
            return new Promise((rs, rj) => next(index, rs, rj));
        }
        index = findNext(index);
        if (index === -1) {
            return resolve({
                completed: true,
                cancelled: false,
            });
        }
        var featurename = featurenames[index];
        var result = getConfiguration(featurename, model);
        if (result instanceof Promise) {
            result.then(apply(index, resolve, reject)).catch(reject);
        } else {
            apply(index, resolve, reject)(result);
        }
    };

    function apply(index, resolve, reject) {
        return function (state) {
            if (typeof state === "object")
                state = state.result;
            console.log(state);
            switch (state) {
                case Configurator.prototype.POSITIVE:
                case Configurator.prototype.NEGATIVE:
                    return select(index, state, resolve, reject);
                case Configurator.prototype.SKIP:
                    return resolve({
                        completed: false,
                        cancelled: false,
                        index: index,
                    });
                case Configurator.prototype.UNDO:
                    model.revertLastSelection();
                    return resolve({
                        completed: false,
                        cancelled: false,
                        index: index,
                    });
                case Configurator.prototype.CANCEL:
                    return resolve({
                        completed: false,
                        cancelled: true,
                        index: index,
                    });
            }
        };
    }

    function findNext(index, resolve, reject) {
        var current = index,
            first = true,
            last = (index + 1) % featurenames.length;
        while (true) {
            current = (current + 1) % featurenames.length;
            if (!first && current === last) {
                return -1;
            }
            first = false;
            if (typeof model.selectionOf(featurenames[current]) === "undefined") {
                return current;
            }
        }
    }

    function select(index, state, resolve, reject) {
        console.log(featurenames, index);
        try {
            if (state === Configurator.prototype.POSITIVE) {
                model.selectFeaturePositive(featurenames[index]);
            } else {
                model.selectFeatureNegative(featurenames[index]);
            }
            resolve({
                completed: false,
                cancelled: false,
                index: index,
            });
        } catch (e) {
            if (invalidBehavior === Configurator.prototype.SELECT_OPPOSITE_ON_INVALID) {
                try {
                    if (state === Configurator.prototype.POSITIVE) {
                        model.selectFeatureNegative(featurenames[index]);
                    } else {
                        model.selectFeaturePositive(featurenames[index]);
                    }
                    resolve({
                        completed: false,
                        cancelled: false,
                        index: index,
                    });
                } catch (e2) {
                    reject(e2);
                }
            } else {
                reject(e);
            }
        }
    }
}

Configurator.prototype.POSITIVE = 1;
Configurator.prototype.NEGATIVE = -1;
Configurator.prototype.SKIP = 0;
Configurator.prototype.UNDO = 2;
Configurator.prototype.CANCEL = -2;

Configurator.prototype.REJECT_ON_INVALID = 0;
Configurator.prototype.SELECT_OPPOSITE_ON_INVALID = 1;
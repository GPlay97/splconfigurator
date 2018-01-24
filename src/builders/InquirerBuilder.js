/* eslint no-console: 0 */
import inquirer from "inquirer";
import inquirer_autocomplete_prompt from "inquirer-autocomplete-prompt";
import Model from "../model/Model";
import TreeStringify from "../serializers/TreeStringify";
//? if (FILE_SYSTEM) {
import fs from "fs";
import JSONSerializer from "../serializers/JSONSerializer";
import {
    PathPrompt
} from "inquirer-path";
//?}

inquirer.registerPrompt("autocomplete", inquirer_autocomplete_prompt);
//? if (FILE_SYSTEM) {
inquirer.registerPrompt("path", PathPrompt);
//? }

var treeStringify = new TreeStringify();

export default function InquirerBuilder(model
    //? if (FILE_SYSTEM){
    , askStore
    //? }
) {
    if (typeof model === "string") {
        model = new Model(model);
    }
    //? if (FILE_SYSTEM){
    this.askStore = askStore;
    //? }

    this.model = model;

}

InquirerBuilder.prototype.inquireChildGroupType = function (resultName) {
    return {
        type: "list",
        message: "Select a group type for the new feature:",
        name: resultName,
        choices: [{
                key: "o",
                name: "Optional",
                value: "optional",
            },
            {
                key: "m",
                name: "Mandatory",
                value: "mandatory",
            },
            {
                key: "e",
                name: "Exclusive",
                value: "exclusive",
            },
            {
                key: "r",
                name: "Or",
                value: "or",
            },
        ],
        default: "o",
    };
};

InquirerBuilder.prototype.inquireName = function (resultName, featureType) {
    return {
        type: "input",
        message: "Select a name for the " + featureType,
        name: resultName,
        validate: val => this.model.getFeaturenames().indexOf(val) === -1 ? true : "Name already in use",
    };
};

InquirerBuilder.prototype.inquireFeature = function (resultName, featureType) {
    var self = this;
    return {
        type: "autocomplete",
        name: resultName,
        message: "Select the " + featureType,
        source: (answersSoFar, input) => new Promise(res => res(self.model.getFeaturenames().filter(n => !input || n.startsWith(input)))),
    };
};

InquirerBuilder.prototype.start = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        function innerResolve(data) {
            if (!data.completed) {
                return self.next(innerResolve, reject);
            }
            //? if (FILE_SYSTEM) {
            if (self.askStore) {
                data.storePromise = new Promise(function (resolve) {
                    inquirer.prompt([{
                        type: "path",
                        name: "path",
                        message: "Enter a path",
                        default: process.cwd(),
                    }, ]).then(data => {
                        fs.writeFileSync(data.path, JSON.stringify(self.model.serializeModel(new JSONSerializer())), "utf8");
                        resolve(true);
                    });
                });
            }
            //? }
            resolve(data.model);
        }
        self.next(innerResolve, reject);
    });
};

InquirerBuilder.prototype.next = function (resolve, reject) {
    if (!resolve) return new Promise(this.next);
    var self = this;
    console.log(self.model.serializeModel(treeStringify));
    var operation = self.inquireOperation();
    var data = operation.then(self.inquireDetails.bind(self));

    Promise.all([operation, data, ]).then(function (results) {
        try {
            var result = function () {
                switch (results[0].operation) {
                    case InquirerBuilder.ADD_FEATURE:
                        self.model.addFeature(results[1].parentName, results[1].featureName, results[1].groupType);
                        return false;
                    case InquirerBuilder.ADD_REQUIRE:
                        self.model.addRequire(results[1].source, results[1].target);
                        return false;
                    case InquirerBuilder.ADD_EXCLUDE:
                        self.model.addExclude(results[1].feature1, results[1].feature2);
                        return false;
                    case InquirerBuilder.EXIT:
                        return true;
                }
            }();
            resolve({
                completed: result,
                model: self.model,
                results: results,
            });
        } catch (e) {
            reject(e);
        }
    });
};

InquirerBuilder.prototype.inquireOperation = function () {
    return inquirer.prompt([{
        type: "expand",
        message: "What would you like to do?",
        name: "operation",
        choices: [{
                key: "f",
                name: "Add a new feature",
                value: InquirerBuilder.ADD_FEATURE,
            },
            {
                key: "r",
                name: "Add a new require constraint",
                value: InquirerBuilder.ADD_REQUIRE,
            },
            {
                key: "e",
                name: "add a new exclude constraint",
                value: InquirerBuilder.ADD_EXCLUDE,
            },
            new inquirer.Separator(),
            /* currently not supported
            {
                key: "d",
                name: "remove a feature",
                value: 3,
            },
            {
                key: "s",
                name: "Remove a require constraint",
                value: 4,
            },
            {
                key: "g",
                name: "Remove an exclude constraint",
                value: 5,
            },
            new inquirer.Separator(),
            */
            {
                key: "q",
                name: "Quit model builder",
                value: InquirerBuilder.EXIT,
            },
        ],
        default: "f",
    }, ]);
};

InquirerBuilder.prototype.inquireDetails = function (result) {
    switch (result.operation) {
        case 0:
            return inquirer.prompt([this.inquireName("featureName", "new feature"), this.inquireFeature("parentName", "parent feature"), this.inquireChildGroupType("groupType"), ]);
        case 1:
            return inquirer.prompt([this.inquireFeature("source", "source feature"), this.inquireFeature("target", "target feature"), ]);
        case 2:
            return inquirer.prompt([this.inquireFeature("feature1", "first feature"), this.inquireFeature("feature2", "second feature"), ]);
        case 6:
            return new Promise(res => res());
    }
};

InquirerBuilder.ADD_FEATURE = 0;
InquirerBuilder.ADD_REQUIRE = 1;
InquirerBuilder.ADD_EXCLUDE = 2;
InquirerBuilder.DEL_FEATURE = 3;
InquirerBuilder.DEL_REQUIRE = 4;
InquirerBuilder.DEL_EXCLUDE = 5;
InquirerBuilder.EXIT = 6;
import inquirer from "inquirer";
import inquirer_autocomplete_prompt from "inquirer-autocomplete-prompt";

inquirer.registerPrompt("autocomplete", inquirer_autocomplete_prompt);

function inquireOperation() {
    return inquirer.prompt([{
        type: "expand",
        message: "What would you like to do?",
        name: "operation",
        choices: [{
                key: "f",
                name: "Add a new feature",
                value: 0,
            },
            {
                key: "r",
                name: "Add a new require constraint",
                value: 1,
            },
            {
                key: "e",
                name: "add a new exclude constraint",
                value: 2,
            },
            new inquirer.Separator(),
            /*
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
                value: 6,
            },
        ],
        default: "f",
    }, ]);
}

function inquireDetails(result) {
    switch (result.operation) {
        case 0:
            return inquirer.prompt([inquireName("value", "new feature"), inquireFeature("parent", "parent feature"), inquireChildGroupType("cgt"), ]);
        case 1:
            return inquirer.prompt([inquireFeature("source", "source feature"), inquireFeature("target", "target feature"), ]);
        case 2:
            return inquirer.prompt([inquireFeature("first", "first feature"), inquireFeature("second", "second feature"), ]);
        case 6:
            return true;
    }
}

function inquireChildGroupType(resultName) {
    return {
        type: "expand",
        message: "Select a group type for the new feature:",
        name: resultName,
        choices: [{
                key: "o",
                name: "Optional",
                value: 0,
            },
            {
                key: "m",
                name: "Mandatory",
                value: 1,
            },
            {
                key: "e",
                name: "Exclusive",
                value: 2,
            },
            {
                key: "r",
                name: "Or",
                value: 3,
            },
        ],
        default: "o",
    };
}

function inquireName(resultName, featureType) {
    return {
        type: "input",
        message: "Select a name for the " + featureType,
        name: resultName,
        validate: val => this.model.getFeaturenames().contains(val) ? true : "Name already in use",
    };
}

function inquireFeature(resultName, featureType) {
    return {
        type: "autocomplete",
        name: resultName,
        message: "Select the " + featureType,
        source: function (answersSoFar, input) {
            new Promise(res =>
                res(this.model.getFeaturenames().filter(n => n.startsWith(input))));
        },
    };
}

export default function InquirerBuilder(model) {
    if (typeof model === "string") {
        model = new model(model);
    }

    this.start = function () {
        inquireOperation().then(inquireDetails);
    };
}
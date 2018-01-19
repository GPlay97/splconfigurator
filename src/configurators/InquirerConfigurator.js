import Configurator from "./Configurator";
import inquirer from "inquirer";
import TreeStringify from "../serializers/TreeStringify";

var treeStringify = new TreeStringify();

function getConfiguration(featurename, model) {
    console.log(model.serializeConfiguration(treeStringify, {
        highlight: featurename,
    }));
    return inquirer.prompt([{
        type: 'expand',
        message: 'Include feature ' + featurename + '?',
        name: 'result',
        choices: [{
                key: 'y',
                name: 'Yes',
                value: Configurator.prototype.POSITIVE,
            },
            {
                key: 'n',
                name: 'No',
                value: Configurator.prototype.NEGATIVE,
            },
            {
                key: 's',
                name: 'Skip',
                value: Configurator.prototype.SKIP,
            },
            new inquirer.Separator(),
            {
                key: 'u',
                name: 'Undo last selection',
                value: Configurator.prototype.UNDO,
            },
            {
                key: 'c',
                name: 'Abort selection process',
                value: Configurator.prototype.CANCEL,
            },
        ],
        default: 'y',
    }]);
}

export default function InquirerConfigurator(model, featurenames) {
    return new Configurator(model, featurenames || model.getFeaturenames(), getConfiguration, Configurator.prototype.SELECT_OPPOSITE_ON_INVALID);
}
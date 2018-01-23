import Configurator from "./Configurator";
import inquirer from "inquirer";
import TreeStringify from "../serializers/TreeStringify";

var treeStringify = new TreeStringify();

function getConfiguration(featurename, model) {
    console.log(model.serializeConfiguration(treeStringify, {
        highlight: featurename,
    }));
    return inquirer.prompt([{
        type: "expand",
        message: "Include feature " + featurename + "?",
        name: "result",
        choices: [{
                key: "y",
                name: "Yes",
                value: Configurator.POSITIVE,
            },
            {
                key: "n",
                name: "No",
                value: Configurator.NEGATIVE,
            },
            {
                key: "s",
                name: "Skip",
                value: Configurator.SKIP,
            },
            new inquirer.Separator(),
            {
                key: "u",
                name: "Undo last selection",
                value: Configurator.UNDO,
            },
            {
                key: "c",
                name: "Abort selection process",
                value: Configurator.CANCEL,
            },
        ],
        default: "y",
    }, ]);
}

export default function InquirerConfigurator(model, featurenames
    //? if (FILE_SYSTEM){
    , askStore
    //? }
) {
    return new Configurator(model, featurenames || model.getFeaturenames(), getConfiguration, Configurator.prototype.SELECT_OPPOSITE_ON_INVALID, askStore);
}
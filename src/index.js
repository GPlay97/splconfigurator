export {default as Model} from "./model/Model";

//? if (EXPOSE_INNERTS) {
export {default as Feature} from "./entities/Feature";
export {default as FeatureError} from "./entities/FeatureError";
export {default as FeatureSelectionStack} from "./entities/FeatureSelectionStack";

export {default as CrossTreeConstraint} from "./entities/crossTreeConstraints/CrossTreeConstraint";
export {default as ExcludeConstraint} from "./entities/crossTreeConstraints/ExcludeConstraint";
export {default as RequireConstraint} from "./entities/crossTreeConstraints/RequireConstraint";

export {default as ChildGroup} from "./entities/childGroups/ChildGroup";
export {default as ExclusiveChildGroup} from "./entities/childGroups/ExclusiveChildGroup";
export {default as MandatoryChildGroup} from "./entities/childGroups/MandatoryChildGroup";
export {default as OptionalChildGroup} from "./entities/childGroups/OptionalChildGroup";
export {default as OrChildGroup} from "./entities/childGroups/OrChildGroup";
//? }

//? if (CONFIGURATORS) {
export {default as Configurator} from "./configurators/Configurator";
//? if (AUTO_CONFIGURATOR) {
export {default as AutoConfigurator} from "./configurators/AutoConfigurator";
//? }
//? if (INQUIRER_CONFIGURATOR) {
export {default as InquirerConfigurator} from "./configurators/InquirerConfigurator";
//? } 
//? }

//? if (SERIALIZERS) {
export {default as Serializer} from "./serializers/Serializer";
//? if (AUTO_CONFIGURATOR) {
export {default as JSONSerializer} from "./serializers/JSONSerializer";
//? }
//? if (INQUIRER_CONFIGURATOR) {
export {default as TreeStringify} from "./serializers/TreeStringify";
//? } 
//? }

//? if (BUILDERS) {
//? if (INQUIRER_BUILDER) {
export {default as InquirerBuilder} from "./builders/InquirerBuilder";
//? }
//? }

//? if (CLI) {
import cliBuild from "./cli/cliBuild";
if (process.mainModule === module) {
    var action = process.argv[2];
    switch(action) {
    case "build":
        cliBuild(process.argv[3]);
        break;
    default:
        console.log("Known operations: build");
    }
}
//? }
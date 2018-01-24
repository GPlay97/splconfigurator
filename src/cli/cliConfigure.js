/* eslint no-console: 0 */
import {
    readFileSync
} from "fs";
import JSONSerializer from "../serializers/JSONSerializer";
import InquirerConfigurator from "../configurators/InquirerConfigurator";

export default function cliConfigure(arg1, arg2) {
    if (arg1.indexOf("/") !== -1) {
        arg1 = new JSONSerializer().deserializeModel(JSON.parse(readFileSync(arg1, "utf8")));
    } else {
        return console.log("configureoperation requires a path to an existing model");
    }
    if (arg2 && arg2.indexOf("/") !== -1) {
        arg1.deserializeConfiguration(new JSONSerializer(), JSON.parse(readFileSync(arg2, "utf8")));
    }
    new InquirerConfigurator(arg1, undefined, true).start().catch(console.log);
}
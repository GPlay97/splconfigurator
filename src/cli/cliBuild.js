/* eslint no-console: 0 */
import InquirerBuilder from "../builders/InquirerBuilder";
import {
    readFileSync
} from "fs";
import JSONSerializer from "../serializers/JSONSerializer";

export default function cliBuild(arg) {
    if (!arg) {
        return console.log("buildoperation requires a path to an existing model or a name for the new model");
    }
    if (arg.indexOf("/") !== -1) {
        arg = new JSONSerializer().deserializeModel(JSON.parse(readFileSync(arg, "utf8")));
    }
    new InquirerBuilder(arg, true).start().catch(console.log);
}
import Serializer from "./Serializer";

function serializeModel(feature) {
    return this.printTree("", "")(feature, 0, "root", false);
}

function deserializeModel() {
    throw "TreeStringify can not deserialite configurations";
}

function serializeConfiguration(feature, options) {
    return this.printTree(this.selectedPositivePrefix, this.selectedNegativePrefix, options ? options.highlight : options)(feature, 0, "root", false);
}

function deserializeConfiguration() {
    throw "TreeStringify can not deserialite configurations";
}

function printTree(selectedPositivePrefix, selectedNegativePrefix, highlight) {
    var self = this;

    function printFeature(feature, indent, type, last) {
        var line = self.lineStart;
        if (feature.name === highlight)
            line += self.highlight;
        if (feature.selection === true) {
            line += selectedPositivePrefix;
        } else if (feature.selection === false) {
            line += selectedNegativePrefix;
        } else {
            line += self.unselectedPrefix;
        }
        line += Array(indent + 1).join(self.indentChar);
        line += self.typeChars[type + (last ? "l" : "")];
        line += feature.name;
        var requireString = feature.crossTreeConstraints.filter(ctc => ctc.type === "require" && ctc.features[0] === feature).map(ctc => ctc.features[1].name).join(","),
            excludeString = feature.crossTreeConstraints.filter(ctc => ctc.type === "exclude").map(ctc => ctc.features[(ctc.features.indexOf(feature) + 1) % 2].name).join(",");
        if (requireString || excludeString)
            line += " (";
        if (requireString)
            line += "requires: " + requireString;
        if (requireString && excludeString)
            line += " and ";
        if (excludeString)
            line += "excludes: " + excludeString;
        if (requireString || excludeString)
            line += ")";
        line += self.lineEnd;
        line += feature.children.reduce((acc, cg) => acc + cg.features.reduce((acc, f, i) => acc + printFeature(f, indent + 1, cg.type, i === cg.features.length - 1), ""), "");
        return line;
    }
    return printFeature;
}

export default function TreeStringify(settings) {
    var serializer = new Serializer(serializeModel, deserializeModel, serializeConfiguration, deserializeConfiguration);
    settings = settings || {
        color: true,
    };
    serializer.printTree = printTree;
    serializer.lineStart = settings.lineStart || " ";
    serializer.lineEnd = settings.lineEnd || "\r\n" + (settings.color ? "\x1b[0m" : "");
    serializer.selectedPositivePrefix = (settings.color ? "\x1b[32m" : "") + (settings.selectedPositivePrefix || "+");
    serializer.selectedNegativePrefix = (settings.color ? "\x1b[31m" : "") + (settings.selectedNegativePrefix || "-");
    serializer.unselectedPrefix = settings.unselectedPrefix || " ";
    serializer.indentChar = settings.indentChar || "  ";
    serializer.typeChars = {
        "exclusive": settings.exclusive || "\u255F\u2B55 ",
        "exclusivel": settings.exclusivel || "\u2559\u2B55 ",
        "or": settings.or || "\u2520\u2B55 ",
        "orl": settings.orl || "\u2516\u2B55 ",
        "optional": settings.optional || "\u251C\u2B55 ",
        "optionall": settings.optionall || "\u2514\u2B55 ",
        "mandatory": settings.mandatory || "\u251C\u2B24 ",
        "mandatoryl": settings.mandatoryl || "\u2514\u2B24 ",
        "root": settings.root || "",
    };
    serializer.highlight = settings.highlight || (settings.color ? "\x1b[1m" : "");
    return serializer;
}
import Serializer from "./Serializer";
import flatMap from "../util/flatMap";

var arrowStyle = {
    "exclude": 'style="dashed";arrowtail="normal";dir="both"',
    "require": 'style="dashed"',
    "mandatory": 'arrowhead="dot"',
    "optional": 'arrowhead="odot"',
    "exclusive": 'arrowtail="odiamond";dir="back"',
    "or": 'arrowtail="diamond";dir="back"',
};

var colorStyles = {
    "true": 'color="green";fontcolor="green"',
    "false": 'color="red";fontcolor="red"',
};

function serializeModel(feature) {
    var result = serializeFeature(feature, false);
    return "digraph G {\r\n" + result[0] + (result[1] ? "\r\n" + result[1] : "") + "\r\n}";
}

function deserializeModel() {
    throw "GraphvizSerializer can not deserialite models";
}

function serializeConfiguration(feature) {
    var result = serializeFeature(feature, true);
    return "digraph G {\r\n" + result[0] + (result[1] ? "\r\n" + result[1] : "") + "\r\n}";
}

function deserializeConfiguration() {
    throw "GraphvizSerializer can not deserialite configurations";
}

function serializeFeature(feature, colors) {
    var nodes = "",
        edges = "";

    nodes += feature.name + (colors && typeof feature.selection !== "undefined" ? "[" + colorStyles[feature.selection] + "]" : "");
    edges += feature.crossTreeConstraints.filter(ctc => ctc.features[0] === feature)
        .map(ctc => ctc.features[0].name + "->" + ctc.features[1].name + "[label=\"<<" + ctc.type + ">>\";" + arrowStyle[ctc.type] + "]").join("\r\n");

    var children = flatMap(cg => cg.features.map(f => serializeFeature(f, colors).concat(feature.name + "->" + f.name + "[" + arrowStyle[cg.type] + "]")), feature.children);
    children.forEach(ce => {
        if (ce[0].length)
            nodes += "\r\n" + ce[0];
        edges += (edges ? "\r\n" : "") + ce[2];
        if (ce[1].length)
            edges += (edges ? "\r\n" : "") + ce[1];
    });
    return [nodes, edges, ];
}

export default function GraphvizSerializer() {
    return new Serializer(serializeModel, deserializeModel, serializeConfiguration, deserializeConfiguration);
}
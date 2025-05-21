"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResult = exports.cleanResultInner = exports.resultOf = exports.resultsOf = void 0;
const utils_1 = require("./utils");
const data_source_1 = require("./data_source");
const prop_function_1 = require("./prop_function");
const replaceTemplatePlaceholders = (input, templateMatch, nodes, propFunctions, isSelfNode) => {
    // GOD format ${:node.prop1.prop2}
    const godResults = resultsOfInner(templateMatch.filter((text) => text.startsWith(":")), nodes, propFunctions, isSelfNode);
    // utilsFunctions ${@now}
    const utilsFuncResult = templateMatch
        .filter((text) => text.startsWith("@"))
        .reduce((tmp, key) => {
        tmp[key] = (0, prop_function_1.utilsFunctions)(key, nodes);
        return tmp;
    }, {});
    return Array.from(templateMatch.keys()).reduce((tmp, key) => {
        if (templateMatch[key].startsWith(":")) {
            return tmp.replaceAll("${" + templateMatch[key] + "}", godResults[key]);
        }
        return tmp.replaceAll("${" + templateMatch[key] + "}", utilsFuncResult[templateMatch[key]]);
    }, input);
};
const resultsOfInner = (input, nodes, propFunctions, isSelfNode = false) => {
    if (Array.isArray(input)) {
        return input.map((inp) => resultsOfInner(inp, nodes, propFunctions, isSelfNode));
    }
    if ((0, utils_1.isNamedInputs)(input)) {
        return (0, exports.resultsOf)(input, nodes, propFunctions, isSelfNode);
    }
    if (typeof input === "string") {
        const templateMatch = [...input.matchAll(/\${([:@][^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            return replaceTemplatePlaceholders(input, templateMatch, nodes, propFunctions, isSelfNode);
        }
    }
    // :node.prod
    return (0, exports.resultOf)((0, utils_1.parseNodeName)(input, isSelfNode, nodes), nodes, propFunctions);
};
const resultsOf = (inputs, nodes, propFunctions, isSelfNode = false) => {
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = (0, utils_1.isNamedInputs)(input) ? (0, exports.resultsOf)(input, nodes, propFunctions, isSelfNode) : resultsOfInner(input, nodes, propFunctions, isSelfNode);
        return tmp;
    }, {});
};
exports.resultsOf = resultsOf;
const resultOf = (source, nodes, propFunctions) => {
    const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
    return (0, data_source_1.getDataFromSource)(result, source, propFunctions);
};
exports.resultOf = resultOf;
// clean up object for anyInput
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.map((result) => (0, exports.cleanResultInner)(result)).filter((result) => !(0, utils_1.isNull)(result));
    }
    if ((0, utils_1.isObject)(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            const value = (0, exports.cleanResultInner)(results[key]);
            if (!(0, utils_1.isNull)(value)) {
                tmp[key] = value;
            }
            return tmp;
        }, {});
    }
    return results;
};
exports.cleanResultInner = cleanResultInner;
const cleanResult = (results) => {
    return Object.keys(results).reduce((tmp, key) => {
        const value = (0, exports.cleanResultInner)(results[key]);
        if (!(0, utils_1.isNull)(value)) {
            tmp[key] = value;
        }
        return tmp;
    }, {});
};
exports.cleanResult = cleanResult;

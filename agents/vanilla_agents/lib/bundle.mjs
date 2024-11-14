import { assert, isObject, sleep, graphDataLatestVersion, GraphAI } from 'graphai';

// This agent strip one long string into chunks using following parameters
//
//  chunkSize: number; // default is 2048
//  overlap: number;   // default is 1/8th of chunkSize.
//
// see example
//  tests/agents/test_string_agent.ts
//
const defaultChunkSize = 2048;
const stringSplitterAgent = async ({ params, namedInputs }) => {
    assert(!!namedInputs, "stringSplitterAgent: namedInputs is UNDEFINED!");
    const source = namedInputs.text;
    const chunkSize = params.chunkSize ?? defaultChunkSize;
    const overlap = params.overlap ?? Math.floor(chunkSize / 8);
    const count = Math.floor(source.length / (chunkSize - overlap)) + 1;
    const contents = new Array(count).fill(undefined).map((_, i) => {
        const startIndex = i * (chunkSize - overlap);
        return source.substring(startIndex, startIndex + chunkSize);
    });
    return { contents, count, chunkSize, overlap };
};
// for test and document
const sampleInput = {
    text: "Here's to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes ... the ones who see things differently -- they're not fond of rules, and they have no respect for the status quo. ... You can quote them, disagree with them, glorify or vilify them, but the only thing you can't do is ignore them because they change things. ... They push the human race forward, and while some may see them as the crazy ones, we see genius, because the people who are crazy enough to think that they can change the world, are the ones who do.",
};
const sampleParams = { chunkSize: 64 };
const sampleResult = {
    contents: [
        "Here's to the crazy ones, the misfits, the rebels, the troublema",
        "roublemakers, the round pegs in the square holes ... the ones wh",
        " ones who see things differently -- they're not fond of rules, a",
        "rules, and they have no respect for the status quo. ... You can ",
        "You can quote them, disagree with them, glorify or vilify them, ",
        "y them, but the only thing you can't do is ignore them because t",
        "ecause they change things. ... They push the human race forward,",
        "forward, and while some may see them as the crazy ones, we see g",
        "we see genius, because the people who are crazy enough to think ",
        "o think that they can change the world, are the ones who do.",
        " do.",
    ],
    count: 11,
    chunkSize: 64,
    overlap: 8,
};
const stringSplitterAgentInfo = {
    name: "stringSplitterAgent",
    agent: stringSplitterAgent,
    mock: stringSplitterAgent,
    inputs: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "text to be chuncked",
            },
        },
        required: ["text"],
    },
    output: {
        type: "object",
        properties: {
            contents: {
                type: "array",
                description: "the array of text chunks",
            },
            count: {
                type: "number",
                description: "the number of chunks",
            },
            chunkSize: {
                type: "number",
                description: "the chunk size",
            },
            overlap: {
                type: "number",
                description: "the overlap size",
            },
        },
    },
    samples: [
        {
            inputs: sampleInput,
            params: sampleParams,
            result: sampleResult,
        },
    ],
    description: "This agent strip one long string into chunks using following parameters",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const processTemplate = (template, match, input) => {
    if (typeof template === "string") {
        if (template === match) {
            return input;
        }
        return template.replace(match, input);
    }
    else if (Array.isArray(template)) {
        return template.map((item) => processTemplate(item, match, input));
    }
    if (isObject(template)) {
        return Object.keys(template).reduce((tmp, key) => {
            tmp[key] = processTemplate(template[key], match, input);
            return tmp;
        }, {});
    }
    return template;
};
const stringTemplateAgent = async ({ params, inputs, namedInputs }) => {
    if (params.template === undefined) {
        if (namedInputs.text) {
            return namedInputs.text;
        }
        console.warn("warning: stringTemplateAgent no template");
    }
    if (inputs && inputs.length > 0) {
        return inputs.reduce((template, input, index) => {
            return processTemplate(template, "${" + index + "}", input);
        }, params.template);
    }
    return Object.keys(namedInputs).reduce((template, key) => {
        return processTemplate(template, "${" + key + "}", namedInputs[key]);
    }, params.template);
};
const sampleNamedInput = { message1: "hello", message2: "test" };
// for test and document
const stringTemplateAgentInfo = {
    name: "stringTemplateAgent",
    agent: stringTemplateAgent,
    mock: stringTemplateAgent,
    samples: [
        // named
        {
            inputs: sampleNamedInput,
            params: { template: "${message1}: ${message2}" },
            result: "hello: test",
        },
        {
            inputs: sampleNamedInput,
            params: { template: ["${message1}: ${message2}", "${message2}: ${message1}"] },
            result: ["hello: test", "test: hello"],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: "${message2}" } },
            result: { apple: "hello", lemon: "test" },
        },
        {
            inputs: sampleNamedInput,
            params: { template: [{ apple: "${message1}", lemon: "${message2}" }] },
            result: [{ apple: "hello", lemon: "test" }],
        },
        {
            inputs: sampleNamedInput,
            params: { template: { apple: "${message1}", lemon: ["${message2}"] } },
            result: { apple: "hello", lemon: ["test"] },
        },
        // graphData
        {
            inputs: { agent: "openAiAgent", row: "hello world", params: { text: "message" } },
            params: {
                template: {
                    version: 0.5,
                    nodes: {
                        ai: {
                            agent: "${agent}",
                            isResult: true,
                            params: "${params}",
                            inputs: { prompt: "${row}" },
                        },
                    },
                },
            },
            result: {
                nodes: {
                    ai: {
                        agent: "openAiAgent",
                        inputs: {
                            prompt: "hello world",
                        },
                        isResult: true,
                        params: { text: "message" },
                    },
                },
                version: 0.5,
            },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const jsonParserAgent = async ({ namedInputs }) => {
    const { text, data } = namedInputs;
    if (data) {
        return JSON.stringify(data, null, 2);
    }
    const match = ("\n" + text).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
    if (match) {
        return JSON.parse(match[1]);
    }
    return JSON.parse(text);
};
const sample_object = { apple: "red", lemon: "yellow" };
const json_str = JSON.stringify(sample_object);
const md_json1 = ["```", json_str, "```"].join("\n");
const md_json2 = ["```json", json_str, "```"].join("\n");
const md_json3 = ["```JSON", json_str, "```"].join("\n");
const jsonParserAgentInfo = {
    name: "jsonParserAgent",
    agent: jsonParserAgent,
    mock: jsonParserAgent,
    inputs: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    output: {
        type: "string",
    },
    samples: [
        {
            inputs: { data: sample_object },
            params: {},
            result: JSON.stringify(sample_object, null, 2),
        },
        {
            inputs: { text: JSON.stringify(sample_object, null, 2) },
            params: {},
            result: sample_object,
        },
        {
            inputs: { text: md_json1 },
            params: {},
            result: sample_object,
        },
        {
            inputs: { text: md_json2 },
            params: {},
            result: sample_object,
        },
        {
            inputs: { text: md_json3 },
            params: {},
            result: sample_object,
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

var lib = {};

Object.defineProperty(lib, "__esModule", { value: true });
var isNamedInputs_1 = lib.isNamedInputs = lib.sample2GraphData = void 0;
const sample2GraphData = (sample, agentName) => {
    const nodes = {};
    const inputs = (() => {
        if (Array.isArray(sample.inputs)) {
            Array.from(sample.inputs.keys()).forEach((key) => {
                nodes["sampleInput" + key] = {
                    value: sample.inputs[key],
                };
            });
            return Object.keys(nodes).map((k) => ":" + k);
        }
        nodes["sampleInput"] = {
            value: sample.inputs,
        };
        return Object.keys(sample.inputs).reduce((tmp, key) => {
            tmp[key] = `:sampleInput.` + key;
            return tmp;
        }, {});
    })();
    nodes["node"] = {
        isResult: true,
        agent: agentName,
        params: sample.params,
        inputs: inputs,
        graph: sample.graph,
    };
    const graphData = {
        version: 0.5,
        nodes,
    };
    return graphData;
};
lib.sample2GraphData = sample2GraphData;
const isNamedInputs = (namedInputs) => {
    return Object.keys(namedInputs || {}).length > 0;
};
isNamedInputs_1 = lib.isNamedInputs = isNamedInputs;

const pushAgent = async ({ namedInputs, }) => {
    assert(isNamedInputs_1(namedInputs), "pushAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
    const { item, items } = namedInputs;
    assert(!!namedInputs.array, "pushAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
    assert(!!(item || items), "pushAgent: namedInputs.item is UNDEFINED! Set inputs: { array: :arrayNodeId, item: :itemNodeId }");
    const array = namedInputs.array.map((item) => item); // shallow copy
    if (item) {
        array.push(item);
    }
    else {
        items.forEach((item) => {
            array.push(item);
        });
    }
    return {
        array,
    };
};
const pushAgentInfo = {
    name: "pushAgent",
    agent: pushAgent,
    mock: pushAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to push an item to",
            },
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item push into the array",
            },
            items: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item push into the array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2], item: 3 },
            params: {},
            result: { array: [1, 2, 3] },
        },
        {
            inputs: { array: [{ apple: 1 }], item: { lemon: 2 } },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }] },
        },
        {
            inputs: { array: [{ apple: 1 }], items: [{ lemon: 2 }, { banana: 3 }] },
            params: {},
            result: { array: [{ apple: 1 }, { lemon: 2 }, { banana: 3 }] },
        },
    ],
    description: "push Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const popAgent = async ({ namedInputs }) => {
    assert(isNamedInputs_1(namedInputs), "popAgent: namedInputs is UNDEFINED!");
    assert(!!namedInputs.array, "popAgent: namedInputs.array is UNDEFINED!");
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.pop();
    return { array, item };
};
const popAgentInfo = {
    name: "popAgent",
    agent: popAgent,
    mock: popAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to pop an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item popped from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: {
                array: [1, 2, 3],
                array2: ["a", "b", "c"],
            },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const shiftAgent = async ({ namedInputs }) => {
    assert(!!namedInputs, "shiftAgent: namedInputs is UNDEFINED!");
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.shift();
    return { array, item };
};
const shiftAgentInfo = {
    name: "shiftAgent",
    agent: shiftAgent,
    mock: shiftAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to shift an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item shifted from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [2, 3],
                item: 1,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["b", "c"],
                item: "a",
            },
        },
    ],
    description: "shift Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const arrayFlatAgent = async ({ namedInputs, params, }) => {
    assert(!!namedInputs, "arrayFlatAgent: namedInputs is UNDEFINED!");
    const depth = params.depth ?? 1;
    const array = namedInputs.array.map((item) => item); // shallow copy
    return { array: array.flat(depth) };
};
const arrayFlatAgentInfo = {
    name: "arrayFlatAgent",
    agent: arrayFlatAgent,
    mock: arrayFlatAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "flat array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    params: {
        type: "object",
        properties: {
            depth: {
                type: "number",
                description: "array depth",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                array: [1, 2, [3]],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: { depth: 2 },
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                array: ["a", "b", "c"],
            },
        },
    ],
    description: "Array Flat Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const arrayJoinAgent = async ({ namedInputs, params, }) => {
    assert(!!namedInputs, "arrayJoinAgent: namedInputs is UNDEFINED!");
    assert(!!namedInputs.array, "arrayJoinAgent: namedInputs.array is UNDEFINED!");
    const separator = params.separator ?? "";
    const { flat } = params;
    const text = flat ? namedInputs.array.flat(flat).join(separator) : namedInputs.array.join(separator);
    return { text };
};
const arrayJoinAgentInfo = {
    name: "arrayJoinAgent",
    agent: arrayJoinAgent,
    mock: arrayJoinAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "array join",
            },
        },
        required: ["array"],
    },
    params: {
        type: "object",
        properties: {
            separator: {
                type: "string",
                description: "array join separator",
            },
            flat: {
                type: "number",
                description: "array flat depth",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "joined text",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                text: "123",
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                text: "abc",
            },
        },
        //
        {
            inputs: { array: [[1], [2], [3]] },
            params: { separator: "|" },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|" },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[1]], [[2], [3]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2|3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 1 },
            result: {
                text: "1|2,3",
            },
        },
        {
            inputs: { array: [[[[1]], [[2], [3]]]] },
            params: { separator: "|", flat: 2 },
            result: {
                text: "1|2|3",
            },
        },
    ],
    description: "Array Join Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  matrix: Two dimentional array of numbers.
//  vector: One dimentional array of numbers.
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
const dotProductAgent = async ({ namedInputs, }) => {
    assert(!!namedInputs, "dotProductAgent: namedInputs is UNDEFINED!");
    const matrix = namedInputs.matrix;
    const vector = namedInputs.vector;
    if (matrix[0].length != vector.length) {
        throw new Error(`dotProduct: Length of vectors do not match. ${matrix[0].length}, ${vector.length}`);
    }
    const contents = matrix.map((vector0) => {
        return vector0.reduce((dotProduct, value, index) => {
            return dotProduct + value * vector[index];
        }, 0);
    });
    return contents;
};
const dotProductAgentInfo = {
    name: "dotProductAgent",
    agent: dotProductAgent,
    mock: dotProductAgent,
    inputs: {
        type: "object",
        properties: {
            matrix: {
                type: "array",
                description: "two dimentional matrix",
                items: {
                    type: "array",
                    items: {
                        type: "number",
                    },
                },
            },
            vector: {
                type: "array",
                description: "the vector",
                items: {
                    type: "number",
                },
            },
        },
        required: ["matrix", "vector"],
    },
    output: {
        type: "array",
    },
    samples: [
        {
            inputs: {
                matrix: [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                ],
                vector: [3, 2],
            },
            params: {},
            result: [7, 17, 27],
        },
        {
            inputs: {
                matrix: [
                    [1, 2],
                    [2, 3],
                ],
                vector: [1, 2],
            },
            params: {},
            result: [5, 8],
        },
    ],
    description: "dotProduct Agent",
    category: ["matrix"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

// This agent returned a sorted array of one array (A) based on another array (B).
// The default sorting order is "decendant".
//
// Parameters:
//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
// Inputs:
//  array: Array<any>; // array to be sorted
//  values: Array<number>; // array of numbers for sorting
//
const sortByValuesAgent = async ({ params, namedInputs }) => {
    assert(!!namedInputs, "sortByValue: namedInputs is UNDEFINED!");
    assert(!!namedInputs.array, "sortByValue: namedInputs.array is UNDEFINED!");
    assert(!!namedInputs.values, "sortByValue: namedInputs.values is UNDEFINED!");
    const direction = (params?.assendant ?? false) ? -1 : 1;
    const array = namedInputs.array;
    const values = namedInputs.values;
    const joined = array.map((item, index) => {
        return { item, value: values[index] };
    });
    const contents = joined
        .sort((a, b) => {
        return (b.value - a.value) * direction;
    })
        .map((a) => {
        return a.item;
    });
    return contents;
};
const sortByValuesAgentInfo = {
    name: "sortByValuesAgent",
    agent: sortByValuesAgent,
    mock: sortByValuesAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to sort",
            },
            values: {
                type: "array",
                description: "values associated with items in the array",
            },
        },
        required: ["array", "values"],
    },
    output: {
        type: "array",
    },
    samples: [
        {
            inputs: {
                array: ["banana", "orange", "lemon", "apple"],
                values: [2, 5, 6, 4],
            },
            params: {},
            result: ["lemon", "orange", "apple", "banana"],
        },
        {
            inputs: {
                array: ["banana", "orange", "lemon", "apple"],
                values: [2, 5, 6, 4],
            },
            params: {
                assendant: true,
            },
            result: ["banana", "apple", "orange", "lemon"],
        },
    ],
    description: "sortByValues Agent",
    category: ["matrix"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const echoAgent = async ({ params, filterParams }) => {
    if (params.filterParams) {
        return filterParams;
    }
    return params;
};
// for test and document
const echoAgentInfo = {
    name: "echoAgent",
    agent: echoAgent,
    mock: echoAgent,
    samples: [
        {
            inputs: {},
            params: { text: "this is test" },
            result: { text: "this is test" },
        },
        {
            inputs: {},
            params: {
                text: "If you add filterParams option, it will respond to filterParams",
                filterParams: true,
            },
            result: {},
        },
    ],
    description: "Echo agent",
    category: ["test"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const countingAgent = async ({ params }) => {
    return {
        list: new Array(params.count).fill(undefined).map((_, i) => {
            return i;
        }),
    };
};
// for test and document
const countingAgentInfo = {
    name: "countingAgent",
    agent: countingAgent,
    mock: countingAgent,
    samples: [
        {
            inputs: {},
            params: { count: 4 },
            result: { list: [0, 1, 2, 3] },
        },
    ],
    description: "Counting agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const copyMessageAgent = async ({ params }) => {
    return {
        messages: new Array(params.count).fill(undefined).map(() => {
            return params.message;
        }),
    };
};
// for test and document
const copyMessageAgentInfo = {
    name: "copyMessageAgent",
    agent: copyMessageAgent,
    mock: copyMessageAgent,
    samples: [
        {
            inputs: {},
            params: { count: 4, message: "hello" },
            result: { messages: ["hello", "hello", "hello", "hello"] },
        },
    ],
    description: "CopyMessage agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const copy2ArrayAgent = async ({ inputs, namedInputs, params }) => {
    const input = isNamedInputs_1(namedInputs) ? (namedInputs.item ? namedInputs.item : namedInputs) : inputs[0];
    return new Array(params.count).fill(undefined).map(() => {
        return input;
    });
};
// for test and document
const copy2ArrayAgentInfo = {
    name: "copy2ArrayAgent",
    agent: copy2ArrayAgent,
    mock: copy2ArrayAgent,
    samples: [
        {
            inputs: { item: { message: "hello" } },
            params: { count: 10 },
            result: [
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
            ],
        },
        {
            inputs: { message: "hello" },
            params: { count: 10 },
            result: [
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
                { message: "hello" },
            ],
        },
        {
            inputs: { item: "hello" },
            params: { count: 10 },
            result: ["hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello", "hello"],
        },
    ],
    description: "Copy2Array agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, inputs, namedInputs, }) => {
    // console.log("executing", nodeId);
    const dataSet = isNamedInputs_1(namedInputs) ? namedInputs.array : inputs;
    return dataSet.reduce((tmp, input) => {
        return { ...tmp, ...input };
    }, { [nodeId]: "hello" });
};
// for test and document
const mergeNodeIdAgentInfo = {
    name: "mergeNodeIdAgent",
    agent: mergeNodeIdAgent,
    mock: mergeNodeIdAgent,
    samples: [
        {
            inputs: { array: [{ message: "hello" }] },
            params: {},
            result: {
                message: "hello",
                test: "hello",
            },
        },
    ],
    description: "merge node id agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const streamMockAgent = async ({ params, filterParams, namedInputs }) => {
    const message = params.message ?? namedInputs.message ?? "";
    for await (const token of message.split("")) {
        if (filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback(token);
        }
        await sleep(params.sleep || 100);
    }
    return { message };
};
// for test and document
const streamMockAgentInfo = {
    name: "streamMockAgent",
    agent: streamMockAgent,
    mock: streamMockAgent,
    inputs: {
        anyOf: [
            {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "streaming message",
                    },
                },
            },
            {
                type: "array",
            },
        ],
    },
    samples: [
        {
            inputs: {},
            params: { message: "this is params test" },
            result: { message: "this is params test" },
        },
        {
            inputs: { message: "this is named inputs test" },
            params: {},
            result: { message: "this is named inputs test" },
        },
    ],
    description: "Stream mock agent",
    category: ["test"],
    author: "Isamu Arimoto",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: true,
};

const nestedAgent = async ({ namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config, onLogCallback, params, }) => {
    const throwError = params.throwError ?? false;
    if (taskManager) {
        const status = taskManager.getStatus(false);
        assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
    }
    assert(!!graphData, "nestedAgent: graph is required");
    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy
    const nodeIds = Object.keys(namedInputs);
    if (nodeIds.length > 0) {
        nodeIds.forEach((nodeId) => {
            if (nestedGraphData.nodes[nodeId] === undefined) {
                // If the input node does not exist, automatically create a static node
                nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
            }
            else {
                // Otherwise, inject the proper data here (instead of calling injectTo method later)
                nestedGraphData.nodes[nodeId]["value"] = namedInputs[nodeId];
            }
        });
    }
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphAI = new GraphAI(nestedGraphData, agents || {}, {
            taskManager,
            agentFilters,
            config,
        });
        // for backward compatibility. Remove 'if' later
        if (onLogCallback) {
            graphAI.onLogCallback = onLogCallback;
        }
        const results = await graphAI.run(false);
        log?.push(...graphAI.transactionLogs());
        return results;
    }
    catch (error) {
        if (error instanceof Error && !throwError) {
            return {
                onError: {
                    message: error.message,
                    error,
                },
            };
        }
        throw error;
    }
};
const nestedAgentInfo = {
    name: "nestedAgent",
    agent: nestedAgent,
    mock: nestedAgent,
    samples: [
        {
            inputs: {
                message: "hello",
            },
            params: {},
            result: {
                test: ["hello"],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "messages" },
                        inputs: { messages: [":message"] },
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "nested Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const mapAgent = async ({ params, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo, config, onLogCallback }) => {
    if (taskManager) {
        const status = taskManager.getStatus();
        assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
    }
    assert(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
    assert(!!graphData, "mapAgent: graph is required");
    const rows = namedInputs.rows.map((item) => item);
    if (params.limit && params.limit < rows.length) {
        rows.length = params.limit; // trim
    }
    const resultAll = params.resultAll ?? false;
    const throwError = params.throwError ?? false;
    const { nodes } = graphData;
    const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy
    const nodeIds = Object.keys(namedInputs);
    nodeIds.forEach((nodeId) => {
        const mappedNodeId = nodeId === "rows" ? "row" : nodeId;
        if (nestedGraphData.nodes[mappedNodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
        }
        else {
            // Otherwise, inject the proper data here (instead of calling injectTo method later)
            nestedGraphData.nodes[mappedNodeId]["value"] = namedInputs[nodeId];
        }
    });
    try {
        if (nestedGraphData.version === undefined && debugInfo.version) {
            nestedGraphData.version = debugInfo.version;
        }
        const graphs = rows.map((row) => {
            const graphAI = new GraphAI(nestedGraphData, agents || {}, {
                taskManager,
                agentFilters: agentFilters || [],
                config,
            });
            graphAI.injectValue("row", row, "__mapAgent_inputs__");
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            return graphAI;
        });
        const runs = graphs.map((graph) => {
            return graph.run(resultAll);
        });
        const results = await Promise.all(runs);
        const nodeIds = Object.keys(results[0]);
        // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
        if (log) {
            const logs = graphs.map((graph, index) => {
                return graph.transactionLogs().map((log) => {
                    log.mapIndex = index;
                    return log;
                });
            });
            log.push(...logs.flat());
        }
        if (params.compositeResult) {
            const compositeResult = nodeIds.reduce((tmp, nodeId) => {
                tmp[nodeId] = results.map((result) => {
                    return result[nodeId];
                });
                return tmp;
            }, {});
            return compositeResult;
        }
        return results;
    }
    catch (error) {
        if (error instanceof Error && !throwError) {
            return {
                onError: {
                    message: error.message,
                    error,
                },
            };
        }
        throw error;
    }
};
const mapAgentInfo = {
    name: "mapAgent",
    agent: mapAgent,
    mock: mapAgent,
    samples: [
        {
            inputs: {
                rows: [1, 2],
            },
            params: {},
            result: [{ test: [1] }, { test: [2] }],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${word}.",
                        },
                        inputs: { word: ":row" },
                        isResult: true,
                    },
                },
            },
            result: [
                { node2: "I love apple." },
                { node2: "I love orange." },
                { node2: "I love banana." },
                { node2: "I love lemon." },
                { node2: "I love melon." },
                { node2: "I love pineapple." },
                { node2: "I love tomato." },
            ],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${item}.",
                        },
                        inputs: { item: ":row.fruit" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "I love apple." }, { node2: "I love orange." }],
        },
        {
            inputs: {
                rows: [{ fruit: "apple" }, { fruit: "orange" }],
                name: "You",
                verb: "like",
            },
            params: {},
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "${name} ${verb} ${fruit}.",
                        },
                        inputs: { fruit: ":row.fruit", name: ":name", verb: ":verb" },
                        isResult: true,
                    },
                },
            },
            result: [{ node2: "You like apple." }, { node2: "You like orange." }],
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    test: [1],
                    row: 1,
                },
                {
                    test: [2],
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
            },
            result: [
                {
                    map: [
                        {
                            test: 1,
                        },
                        {
                            test: 1,
                        },
                    ],
                    row: 1,
                    test: 1,
                },
                {
                    map: [
                        {
                            test: 2,
                        },
                        {
                            test: 2,
                        },
                    ],
                    test: 2,
                    row: 2,
                },
            ],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "row" },
                        inputs: { row: ":row" },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "row" },
                                    inputs: { row: ":row" },
                                },
                            },
                        },
                    },
                },
            },
        },
        // old response
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
            },
            params: {
                compositeResult: true,
            },
            graph: {
                nodes: {
                    node2: {
                        agent: "stringTemplateAgent",
                        params: {
                            template: "I love ${row}.",
                        },
                        inputs: { row: ":row" },
                        isResult: true,
                    },
                },
            },
            result: {
                node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                },
            },
        },
        {
            inputs: {
                rows: [1, 2],
            },
            params: {
                resultAll: true,
                compositeResult: true,
            },
            result: {
                test: [[1], [2]],
                map: [
                    {
                        test: [[[1]], [[1]]],
                    },
                    {
                        test: [[[2]], [[2]]],
                    },
                ],
                row: [1, 2],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "rows" },
                        inputs: { rows: [":row"] },
                    },
                    map: {
                        agent: "mapAgent",
                        inputs: { rows: [":test", ":test"] },
                        params: {
                            compositeResult: true,
                        },
                        graph: {
                            nodes: {
                                test: {
                                    isResult: true,
                                    agent: "copyAgent",
                                    params: { namedKey: "rows" },
                                    inputs: { rows: [":row"] },
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const totalAgent = async ({ namedInputs }) => {
    assert(isNamedInputs_1(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    assert(!!namedInputs?.array, "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    return namedInputs.array.reduce((result, input) => {
        const inputArray = Array.isArray(input) ? input : [input];
        inputArray.forEach((innerInput) => {
            Object.keys(innerInput).forEach((key) => {
                const value = innerInput[key];
                if (result[key]) {
                    result[key] += value;
                }
                else {
                    result[key] = value;
                }
            });
        });
        return result;
    }, {});
};
//
const totalAgentInfo = {
    name: "totalAgent",
    agent: totalAgent,
    mock: totalAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { a: 6 },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: {},
            result: { a: 6, b: -4, c: 10, d: -10 },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: {},
            result: { a: 1 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: {},
            result: { a: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { a: 6 },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: {},
            result: { a: 6, b: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: {},
            result: { a: 6, b: 2 },
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/snakajima/graphai",
    license: "MIT",
};

const dataSumTemplateAgent = async ({ namedInputs }) => {
    assert(isNamedInputs_1(namedInputs), "dataSumTemplateAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    assert(!!namedInputs?.array, "dataSumTemplateAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    return namedInputs.array.reduce((tmp, input) => {
        return tmp + input;
    }, 0);
};
const dataSumTemplateAgentInfo = {
    name: "dataSumTemplateAgent",
    agent: dataSumTemplateAgent,
    mock: dataSumTemplateAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array of numbers to calculate the sum of",
                items: {
                    type: "integer",
                },
            },
        },
        required: ["array"],
    },
    output: {
        type: "number",
    },
    samples: [
        {
            inputs: { array: [1] },
            params: {},
            result: 1,
        },
        {
            inputs: { array: [1, 2] },
            params: {},
            result: 3,
        },
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: 6,
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const applyFilter = (object, index, arrayInputs, include, exclude, alter, inject, swap, inspect) => {
    const propIds = include ? include : Object.keys(object);
    const excludeSet = new Set(exclude ?? []);
    const result = propIds.reduce((tmp, propId) => {
        if (!excludeSet.has(propId)) {
            const mapping = alter && alter[propId];
            if (mapping && mapping[object[propId]]) {
                tmp[propId] = mapping[object[propId]];
            }
            else {
                tmp[propId] = object[propId];
            }
        }
        return tmp;
    }, {});
    if (inject) {
        inject.forEach((item) => {
            if (item.index === undefined || item.index === index) {
                result[item.propId] = arrayInputs[item.from];
            }
        });
    }
    if (inspect) {
        inspect.forEach((item) => {
            const value = arrayInputs[item.from ?? 1]; // default is arrayInputs[1]
            if (item.equal) {
                result[item.propId] = item.equal === value;
            }
            else if (item.notEqual) {
                result[item.propId] = item.notEqual !== value;
            }
        });
    }
    if (swap) {
        Object.keys(swap).forEach((key) => {
            const tmp = result[key];
            result[key] = result[swap[key]];
            result[swap[key]] = tmp;
        });
    }
    return result;
};
const propertyFilterAgent = async ({ namedInputs, params }) => {
    const { include, exclude, alter, inject, swap, inspect } = params;
    const { array, item } = namedInputs;
    if (array) {
        // This is advanced usage, including "inject" and "inspect", which uses
        // array[1], array[2], ...
        const [target] = array; // Extract the first one
        if (Array.isArray(target)) {
            return target.map((item, index) => applyFilter(item, index, array, include, exclude, alter, inject, swap, inspect));
        }
        return applyFilter(target, 0, array, include, exclude, alter, inject, swap, inspect);
    }
    else if (item) {
        return applyFilter(item, 0, [], include, exclude, alter, inject, swap, inspect);
    }
    return false;
};
const testInputs = {
    array: [
        [
            { color: "red", model: "Model 3", type: "EV", maker: "Tesla", range: 300 },
            { color: "blue", model: "Model Y", type: "EV", maker: "Tesla", range: 400 },
        ],
        "Tesla Motors",
    ],
};
const propertyFilterAgentInfo = {
    name: "propertyFilterAgent",
    agent: propertyFilterAgent,
    mock: propertyFilterAgent,
    inputs: {
        type: "object",
    },
    output: {
        type: "any",
        properties: {
            array: {
                type: "array",
                description: "the array to apply filter",
            },
            item: {
                type: "object",
                description: "the object to apply filter",
            },
        },
    },
    samples: [
        {
            inputs: { array: [testInputs.array[0][0]] },
            params: { include: ["color", "model"] },
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: { item: testInputs.array[0][0] },
            params: { include: ["color", "model"] },
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: testInputs,
            params: { include: ["color", "model"] },
            result: [
                { color: "red", model: "Model 3" },
                { color: "blue", model: "Model Y" },
            ],
        },
        {
            inputs: testInputs,
            params: { exclude: ["color", "model"] },
            result: [
                { type: "EV", maker: "Tesla", range: 300 },
                { type: "EV", maker: "Tesla", range: 400 },
            ],
        },
        {
            inputs: { item: testInputs.array[0][0] },
            params: { exclude: ["color", "model"] },
            result: { type: "EV", maker: "Tesla", range: 300 },
        },
        {
            inputs: testInputs,
            params: { alter: { color: { red: "blue", blue: "red" } } },
            result: [
                {
                    color: "blue",
                    model: "Model 3",
                    type: "EV",
                    maker: "Tesla",
                    range: 300,
                },
                {
                    color: "red",
                    model: "Model Y",
                    type: "EV",
                    maker: "Tesla",
                    range: 400,
                },
            ],
        },
        {
            inputs: { item: testInputs.array[0][0] },
            params: { alter: { color: { red: "blue", blue: "red" } } },
            result: {
                color: "blue",
                model: "Model 3",
                type: "EV",
                maker: "Tesla",
                range: 300,
            },
        },
        {
            inputs: testInputs,
            params: { swap: { maker: "model" } },
            result: [
                {
                    color: "red",
                    model: "Tesla",
                    type: "EV",
                    maker: "Model 3",
                    range: 300,
                },
                {
                    color: "blue",
                    model: "Tesla",
                    type: "EV",
                    maker: "Model Y",
                    range: 400,
                },
            ],
        },
        {
            inputs: { item: testInputs.array[0][0] },
            params: { swap: { maker: "model" } },
            result: {
                color: "red",
                model: "Tesla",
                type: "EV",
                maker: "Model 3",
                range: 300,
            },
        },
        {
            inputs: testInputs,
            params: { inject: [{ propId: "maker", from: 1 }] },
            result: [
                {
                    color: "red",
                    model: "Model 3",
                    type: "EV",
                    maker: "Tesla Motors",
                    range: 300,
                },
                {
                    color: "blue",
                    model: "Model Y",
                    type: "EV",
                    maker: "Tesla Motors",
                    range: 400,
                },
            ],
        },
        {
            inputs: testInputs,
            params: { inject: [{ propId: "maker", from: 1, index: 0 }] },
            result: [
                {
                    color: "red",
                    model: "Model 3",
                    type: "EV",
                    maker: "Tesla Motors",
                    range: 300,
                },
                {
                    color: "blue",
                    model: "Model Y",
                    type: "EV",
                    maker: "Tesla",
                    range: 400,
                },
            ],
        },
        {
            inputs: testInputs,
            params: {
                inspect: [
                    { propId: "isTesla", equal: "Tesla Motors" }, // from: 1 is implied
                    { propId: "isGM", notEqual: "Tesla Motors", from: 1 },
                ],
            },
            result: [
                {
                    color: "red",
                    model: "Model 3",
                    type: "EV",
                    maker: "Tesla",
                    range: 300,
                    isTesla: true,
                    isGM: false,
                },
                {
                    color: "blue",
                    model: "Model Y",
                    type: "EV",
                    maker: "Tesla",
                    range: 400,
                    isTesla: true,
                    isGM: false,
                },
            ],
        },
    ],
    description: "Filter properties based on property name either with 'include', 'exclude', 'alter', 'swap', 'inject', 'inspect'",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const copyAgent = async ({ namedInputs, params }) => {
    const { namedKey } = params;
    assert(isNamedInputs_1(namedInputs), "copyAgent: namedInputs is UNDEFINED!");
    if (namedKey) {
        return namedInputs[namedKey];
    }
    return namedInputs;
};
const copyAgentInfo = {
    name: "copyAgent",
    agent: copyAgent,
    mock: copyAgent,
    inputs: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    output: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    samples: [
        {
            inputs: { color: "red", model: "Model 3" },
            params: {},
            result: { color: "red", model: "Model 3" },
        },
        {
            inputs: { array: ["Hello World", "Discarded"] },
            params: {},
            result: { array: ["Hello World", "Discarded"] },
        },
        {
            inputs: { color: "red", model: "Model 3" },
            params: { namedKey: "color" },
            result: "red",
        },
    ],
    description: "Returns namedInputs",
    category: ["data"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const vanillaFetchAgent = async ({ namedInputs, params }) => {
    const { url, method, queryParams, headers, body } = namedInputs;
    const throwError = params.throwError ?? false;
    const url0 = new URL(url);
    const headers0 = headers ? { ...headers } : {};
    if (queryParams) {
        const params = new URLSearchParams(queryParams);
        url0.search = params.toString();
    }
    if (body) {
        headers0["Content-Type"] = "application/json";
    }
    const fetchOptions = {
        method: (method ?? body) ? "POST" : "GET",
        headers: new Headers(headers0),
        body: body ? JSON.stringify(body) : undefined,
    };
    if (params?.debug) {
        return {
            url: url0.toString(),
            method: fetchOptions.method,
            headers: headers0,
            body: fetchOptions.body,
        };
    }
    const response = await fetch(url0.toString(), fetchOptions);
    if (!response.ok) {
        const status = response.status;
        const type = params?.type ?? "json";
        const error = type === "json" ? await response.json() : await response.text();
        if (throwError) {
            throw new Error(`HTTP error: ${status}`);
        }
        return {
            onError: {
                message: `HTTP error: ${status}`,
                status,
                error,
            },
        };
    }
    const result = await (async () => {
        const type = params?.type ?? "json";
        if (type === "json") {
            return await response.json();
        }
        else if (type === "text") {
            return response.text();
        }
        throw new Error(`Unknown Type! ${type}`);
    })();
    return result;
};
const vanillaFetchAgentInfo = {
    name: "vanillaFetchAgent",
    agent: vanillaFetchAgent,
    mock: vanillaFetchAgent,
    inputs: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: "baseurl",
            },
            method: {
                type: "string",
                description: "HTTP method",
            },
            headers: {
                type: "object",
                description: "HTTP headers",
            },
            quaryParams: {
                type: "object",
                description: "Query parameters",
            },
            body: {
                anyOf: [{ type: "string" }, { type: "object" }],
                description: "body",
            },
        },
        required: ["url"],
    },
    output: {
        type: "array",
    },
    samples: [
        {
            inputs: { url: "https://www.google.com", queryParams: { foo: "bar" }, headers: { "x-myHeader": "secret" } },
            params: {
                debug: true,
            },
            result: {
                method: "GET",
                url: "https://www.google.com/?foo=bar",
                headers: {
                    "x-myHeader": "secret",
                },
                body: undefined,
            },
        },
        {
            inputs: { url: "https://www.google.com", body: { foo: "bar" } },
            params: {
                debug: true,
            },
            result: {
                method: "POST",
                url: "https://www.google.com/",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foo: "bar" }),
            },
        },
    ],
    description: "Retrieves JSON data from the specified URL",
    category: ["service"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const sleeperAgent = async ({ params, namedInputs }) => {
    await sleep(params?.duration ?? 10);
    return namedInputs;
};
const sleeperAgentInfo = {
    name: "sleeperAgent",
    agent: sleeperAgent,
    mock: sleeperAgent,
    samples: [
        {
            inputs: {},
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: [{ a: 1 }, { b: 2 }],
            params: { duration: 1 },
            result: {},
        },
        {
            inputs: { array: [{ a: 1 }, { b: 2 }] },
            params: { duration: 1 },
            result: {
                array: [{ a: 1 }, { b: 2 }],
            },
        },
    ],
    description: "sleeper Agent",
    category: ["sleeper"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const compare = (_array) => {
    if (_array.length !== 3) {
        throw new Error(`compare inputs length must must be 3`);
    }
    const array = _array.map((value) => {
        if (Array.isArray(value)) {
            return compare(value);
        }
        return value;
    });
    const [a, operator, b] = array;
    if (operator === "==") {
        return a === b;
    }
    if (operator === "!=") {
        return a !== b;
    }
    if (operator === ">") {
        return Number(a) > Number(b);
    }
    if (operator === ">=") {
        return Number(a) >= Number(b);
    }
    if (operator === "<") {
        return Number(a) < Number(b);
    }
    if (operator === "<=") {
        return Number(a) <= Number(b);
    }
    if (operator === "||") {
        return !!a || !!b;
    }
    if (operator === "&&") {
        return !!a && !!b;
    }
    if (operator === "XOR") {
        return !!a === !b;
    }
    throw new Error(`unknown compare operator`);
};
const compareAgent = async ({ namedInputs }) => {
    return compare(namedInputs.array);
};
const compareAgentInfo = {
    name: "compareAgent",
    agent: compareAgent,
    mock: compareAgent,
    inputs: {},
    output: {},
    samples: [
        {
            inputs: { array: ["abc", "==", "abc"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["abc", "==", "abcd"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["abc", "!=", "abc"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["abc", "!=", "abcd"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">", "5"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">", "15"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, ">", 5] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">", 15] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", ">=", "5"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", ">=", "10"] },
            params: {},
            result: true,
        },
        {
            // 10
            inputs: { array: ["10", ">=", "19"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, ">=", 5] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">=", 10] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, ">=", 19] },
            params: {},
            result: false,
        },
        //
        {
            inputs: { array: ["10", "<", "5"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", "<", "15"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<", 5] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, "<", 15] },
            params: {},
            result: true,
        },
        {
            inputs: { array: ["10", "<=", "5"] },
            params: {},
            result: false,
        },
        {
            inputs: { array: ["10", "<=", "10"] },
            params: {},
            result: true,
        },
        {
            // 20
            inputs: { array: ["10", "<=", "19"] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<=", 5] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [10, "<=", 10] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [10, "<=", 19] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [true, "||", false] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "||", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "&&", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "&&", true] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [true, "XOR", false] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "XOR", true] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [false, "XOR", false] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [true, "XOR", true] },
            params: {},
            result: false,
        },
        //
        {
            inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
            params: {},
            result: true,
        },
        {
            inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
            params: {},
            result: false,
        },
        {
            inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
            params: {},
            result: true,
        },
    ],
    description: "compare",
    category: ["compare"],
    author: "Receptron",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

const defaultEmbeddingModel = "text-embedding-3-small";
const OpenAI_embedding_API = "https://api.openai.com/v1/embeddings";
// This agent retrieves embedding vectors for an array of strings using OpenAI's API
//
// Parameters:
//   model: Specifies the model (default is "text-embedding-3-small")
// NamedInputs:
//   array: Array<string>
//   item: string,
// Result:
//   contents: Array<Array<number>>
//
const stringEmbeddingsAgent = async ({ params, namedInputs }) => {
    const { array, item } = namedInputs;
    const sources = array ?? [item];
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY key is not set in environment variables.");
    }
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };
    const response = await fetch(OpenAI_embedding_API, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            input: sources,
            model: params?.model ?? defaultEmbeddingModel,
        }),
    });
    const jsonResponse = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const embeddings = jsonResponse.data.map((object) => {
        return object.embedding;
    });
    return embeddings;
};
const stringEmbeddingsAgentInfo = {
    name: "stringEmbeddingsAgent",
    agent: stringEmbeddingsAgent,
    mock: stringEmbeddingsAgent,
    samples: [],
    description: "Embeddings Agent",
    category: ["embedding"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};

export { arrayFlatAgentInfo as arrayFlatAgent, arrayJoinAgentInfo as arrayJoinAgent, compareAgentInfo as compareAgent, copy2ArrayAgentInfo as copy2ArrayAgent, copyAgentInfo as copyAgent, copyMessageAgentInfo as copyMessageAgent, countingAgentInfo as countingAgent, dataSumTemplateAgentInfo as dataSumTemplateAgent, dotProductAgentInfo as dotProductAgent, echoAgentInfo as echoAgent, jsonParserAgentInfo as jsonParserAgent, mapAgentInfo as mapAgent, mergeNodeIdAgentInfo as mergeNodeIdAgent, nestedAgentInfo as nestedAgent, popAgentInfo as popAgent, propertyFilterAgentInfo as propertyFilterAgent, pushAgentInfo as pushAgent, shiftAgentInfo as shiftAgent, sleeperAgentInfo as sleeperAgent, sortByValuesAgentInfo as sortByValuesAgent, streamMockAgentInfo as streamMockAgent, stringEmbeddingsAgentInfo as stringEmbeddingsAgent, stringSplitterAgentInfo as stringSplitterAgent, stringTemplateAgentInfo as stringTemplateAgent, totalAgentInfo as totalAgent, vanillaFetchAgentInfo as vanillaFetchAgent };
//# sourceMappingURL=bundle.mjs.map
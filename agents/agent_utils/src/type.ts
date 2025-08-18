// Type definitions for the main types used in `namedInputs` and agent response data.
// In GraphAI, follow these definitions as closely as possible to standardize inputs and outputs.
// Related document
//  https://github.com/receptron/graphai/blob/main/docs/inputs.md

// for Array
export type GraphAIArray<Item = unknown> = { array: Array<Item> };
export type GraphAIItem<Item = unknown> = { item: Item };
export type GraphAIItems<Item = unknown> = { items: Array<Item> };

// array + item
export type GraphAIArrayWithItem<Item = unknown> = GraphAIArray<Item> & GraphAIItem<Item>;

// array + items
export type GraphAIArrayWithItems<Item = unknown> = GraphAIArray<Item> & GraphAIItems<Item>;

// array + item?
export type GraphAIArrayWithOptionalItem<Item = unknown> = GraphAIArray<Item> & Partial<GraphAIItem<Item>>;

// array + items?
export type GraphAIArrayWithOptionalItems<Item = unknown> = GraphAIArray<Item> & Partial<GraphAIItems<Item>>;

// array + item? + items?
export type GraphAIArrayWithOptionalItemAndItems<Item = unknown> = GraphAIArray<Item> & Partial<GraphAIItem<Item> & GraphAIItems<Item>>;

// array + item + items
export type GraphAIArrayWithItemAndItems<Item = unknown> = GraphAIArray<Item> & GraphAIItem<Item> & GraphAIItems<Item>;

// array? + items?
export type GraphAIWithOptionalArrayAndItem<Item = unknown> = Partial<GraphAIArray<Item> & GraphAIItem<Item>>;

// for text
export type GraphAIText = { text: string };
export type GraphAINullableText = { text: string | null };

// for data
export type GraphAIData<Data = unknown> = { data: Data };

// for result
export type GraphAIResult<Result = unknown> = { result: Result };

// text? + data?
export type GraphAIWithOptionalTextAndData<Item = unknown> = Partial<GraphAIText & GraphAIData<Item>>;

// for result
export type GraphAIThrowError = { throwError: boolean }; // deprecated.  It was used up to version 1.x.
export type GraphAISupressError = { supressError: boolean }; //  It is used from version 2.0.0 and above.
export type GraphAIDebug = { debug: boolean };

// for llm
export type GraphAIMessageRole = "user" | "system" | "assistant" | "tool" | "developer";
export type GraphAIMessagePayload<Content = string> = { role: GraphAIMessageRole; content: Content | null };
export type GraphAIMessage<Content = string> = { message: GraphAIMessagePayload<Content> | null };
export type GraphAIMessages<Content = string> = { messages: Array<GraphAIMessagePayload<Content>> };
export type GraphAIToolPayload = { id: string; name: string; arguments?: unknown };
export type GraphAITool = { tool: GraphAIToolPayload };
export type GraphAIToolCalls = { tool_calls: Array<GraphAIToolPayload> };

// for file system
export type GraphAIFileName = { file: string };
export type GraphAIDirName = { dir: string };
export type GraphAIDirNames = { dirs: string[] };
export type GraphAIBaseDirName = { baseDir: string };
export type GraphAIPathName = { path: string };
export type GraphAIBuffer<BufferType = unknown> = { buffer: BufferType }; // BufferType is node buffer or npm buffer(web)

// for type info
export type GraphAIType = { type: string };
export type GraphAIInputType = { inputType: string };
export type GraphAIOutputType = { outputType: string };
export type GraphAIDataType = { dataType: string };

// error
export type GraphAIOnError<ErrorData = Error> = {
  onError: {
    message: string;
    status?: number;
    error: ErrorData;
  };
};

// forParam
export type GraphAIFlatResponse = { flatResponse: boolean };

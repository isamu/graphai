
# @graphai/vanilla_node_agents for GraphAI

Vanilla node agents for GraphAI.

### Install

```sh
yarn add @graphai/vanilla_node_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { fileReadAgent, fileWriteAgent, pathUtilsAgent } from "@graphai/vanilla_node_agents";

const agents = { fileReadAgent, fileWriteAgent, pathUtilsAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- fileReadAgent - Read data from file system and returns data
- fileWriteAgent - Write data to file system
- pathUtilsAgent - Path utils

### Input/Output/Params Schema & samples
 - [fileReadAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/fileReadAgent.md)
 - [fileWriteAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/fileWriteAgent.md)
 - [pathUtilsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/pathUtilsAgent.md)

### Input/Params example
 - fileReadAgent


`inputs.file` specifies a single file name to read.

`inputs.array` specifies multiple file names to read.

`params.baseDir` is required and defines the root directory where files are located.

`params.outputType` optionally controls the output format: 'text' for UTF-8 string, 'base64' for Base64-encoded string, 'stream' for readable stream, or omit for Buffer output.

```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "baseDir": "/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "baseDir": "/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/",
    "outputType": "base64"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "baseDir": "/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/",
    "outputType": "text"
  }
}
```


```typescript
// Reads a single file named 'test.txt' from the given base directory and returns its contents as a UTF-8 string.
{
  "inputs": {
    "file": "test.txt"
  },
  "params": {
    "baseDir": "/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/",
    "outputType": "text"
  }
}
```

 - fileWriteAgent


```typescript
{
  "inputs": {
    "file": "write.txt",
    "text": "hello"
  },
  "params": {
    "baseDir": "/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/"
  }
}
```

 - pathUtilsAgent


```typescript
{
  "inputs": {
    "dirs": [
      "/base/",
      "tmp/",
      "test.txt"
    ]
  },
  "params": {
    "method": "resolve"
  }
}
```


```typescript
{
  "inputs": {
    "dirs": [
      "base/",
      "tmp/",
      "test.txt"
    ]
  },
  "params": {
    "method": "join"
  }
}
```


```typescript
{
  "inputs": {
    "path": "base///tmp//test.txt"
  },
  "params": {
    "method": "normalize"
  }
}
```











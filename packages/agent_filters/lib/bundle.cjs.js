"use strict";var e=require("graphai"),t=require("ajv"),r=require("@noble/hashes/sha2");const a=(e,r,a,n)=>{if(!(new t).compile(e)(r))throw new Error(`${a}(${n??"func"}) schema not matched`);return!0};const n=async(e,t,r,a,n)=>{const s=async function*(e,t,r){const{params:a,namedInputs:n,debugInfo:s,filterParams:o}=t,i={params:a,debugInfo:s,filterParams:o,namedInputs:n},c={...r,"Content-Type":"text/event-stream"},u=await fetch(e,{headers:c,method:"POST",body:JSON.stringify(i)}),d=u.body?.getReader();if(200!==u.status||!d)throw new Error("Request failed");const l=new TextDecoder("utf-8");let p=!1;for(;!p;){const{done:e,value:t}=await d.read();if(e)p=e,d.releaseLock();else{const e=l.decode(t,{stream:!0});yield e}}}(t,r,a),o=[];for await(const t of s)n&&console.log(t),t&&(o.push(t),-1===o.join("").indexOf("___END___")&&e.filterParams.streamTokenCallback&&e.filterParams.streamTokenCallback(t));const i=o.join("").split("___END___")[1];return JSON.parse(i)},s=t=>Array.isArray(t)?t.map((e=>s(e))):e.isObject(t)?Object.keys(t).sort().reduce(((e,r)=>(e[r]=t[r],e)),{}):t,o=e=>{const{namedInputs:t,params:a,debugInfo:n}=e,{agentId:o}=n,i=r.sha256(JSON.stringify(s({namedInputs:t,params:a,agentId:o})));return btoa(String.fromCharCode(...i))};exports.agentFilterRunnerBuilder=e=>{const t=e;return(e,r)=>{let a=0;const n=e=>{const s=t[a++];return s?s.agent(e,n):r(e)};return n(e)}},exports.agentInputValidator=a,exports.cacheAgentFilterGenerator=e=>{const{getCache:t,setCache:r,getCacheKey:a}=e;return async(e,n)=>{if("pureAgent"===e.cacheType){const s=a?a(e):o(e),i=await t(s);if(i)return i;const c=await n(e);return await r(s,c),c}return"impureAgent"===e.cacheType&&(e.filterParams.cache={getCache:t,setCache:r,getCacheKey:o}),n(e)}},exports.httpAgentFilter=async(t,r)=>{const{params:a,debugInfo:s,filterParams:o,namedInputs:i,config:c}=t;if(o?.server){const{baseUrl:r,isDebug:u,serverAgentUrlDictionary:d}=o.server,l=c?.headers??{};if(!e.isObject(l))throw new Error("httpAgentFilter: headers is not object.");const p=s.agentId,f=void 0!==o.streamTokenCallback,g=d&&p&&d[p]?d[p]:[r,p].join("/");void 0===g&&console.log("httpAgentFilter: Url is not defined");const m={params:a,debugInfo:s,filterParams:o,namedInputs:i,inputs:i};return f?await n(t,g,m,l,u):await(async(e,t,r)=>{const a={...r,"Content-Type":"application/json"},n=await fetch(e,{method:"post",headers:a,body:JSON.stringify(t)});return await n.json()})(g,m,l)}return r(t)},exports.namedInputValidatorFilter=async(e,t)=>{const{inputSchema:r,namedInputs:n}=e,{agentId:s,nodeId:o}=e.debugInfo;return r&&"array"!==r.type&&a(r,n||{},o,s),t(e)},exports.sortObjectKeys=s,exports.streamAgentFilterGenerator=t=>async(r,a)=>(r.debugInfo.isResult&&(r.filterParams.streamTokenCallback=a=>{r.debugInfo.state===e.NodeState.Executing&&t(r,a)}),a(r));
//# sourceMappingURL=bundle.cjs.js.map

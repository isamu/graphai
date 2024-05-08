"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataObjectMergeTemplateAgent = void 0;
__exportStar(require("./vanilla"), exports);
// Agents that use npm modules will be added here.
var data_object_merge_template_agent_1 = require("../experimental_agents/data_agents/data_object_merge_template_agent");
Object.defineProperty(exports, "dataObjectMergeTemplateAgent", { enumerable: true, get: function () { return data_object_merge_template_agent_1.dataObjectMergeTemplateAgent; } });
__exportStar(require("./sleeper_agents"), exports);
__exportStar(require("./llm_agents"), exports);
__exportStar(require("./service_agents"), exports);
__exportStar(require("./token_agent"), exports);

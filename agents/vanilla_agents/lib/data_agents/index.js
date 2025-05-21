"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjectAgent = exports.lookupDictionaryAgent = exports.copyAgent = exports.propertyFilterAgent = exports.dataSumTemplateAgent = exports.totalAgent = void 0;
const total_agent_1 = __importDefault(require("./total_agent"));
exports.totalAgent = total_agent_1.default;
const data_sum_template_agent_1 = __importDefault(require("./data_sum_template_agent"));
exports.dataSumTemplateAgent = data_sum_template_agent_1.default;
const property_filter_agent_1 = __importDefault(require("./property_filter_agent"));
exports.propertyFilterAgent = property_filter_agent_1.default;
const copy_agent_1 = __importDefault(require("./copy_agent"));
exports.copyAgent = copy_agent_1.default;
const lookup_dictionary_agent_1 = __importDefault(require("./lookup_dictionary_agent"));
exports.lookupDictionaryAgent = lookup_dictionary_agent_1.default;
const merge_objects_agent_1 = __importDefault(require("./merge_objects_agent"));
exports.mergeObjectAgent = merge_objects_agent_1.default;

import {
  InputIcon,
  OutputIcon,
  LlmIcon,
  TextIcon,
  ApiIcon,
  MathIcon,
  DatabaseIcon,
  FilterIcon,
  ConditionIcon,
} from './icons';
import { parseVariables } from './parseVariables';

export const nodeGroups = [
  { label: 'Input', types: ['customInput', 'api', 'database'] },
  { label: 'Processing', types: ['llm', 'math', 'filter', 'condition'] },
  { label: 'Output', types: ['customOutput', 'text'] },
];

export const nodeConfigs = {
  customInput: {
    toolbarLabel: 'Input',
    label: 'Input',
    icon: InputIcon,
    accent: '#2F9E44',
    handles: [{ type: 'source', position: 'right', id: 'value' }],
    fields: [
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        default: 'Text',
      },
    ],
  },

  llm: {
    toolbarLabel: 'LLM',
    label: 'LLM',
    icon: LlmIcon,
    accent: '#7048E8',
    description: 'This is a LLM.',
    handles: [
      { type: 'target', position: 'left', id: 'system', style: { top: `${100 / 3}%` } },
      { type: 'target', position: 'left', id: 'prompt', style: { top: `${200 / 3}%` } },
      { type: 'source', position: 'right', id: 'response' },
    ],
    fields: [],
  },

  customOutput: {
    toolbarLabel: 'Output',
    label: 'Output',
    icon: OutputIcon,
    accent: '#E03131',
    handles: [{ type: 'target', position: 'left', id: 'value' }],
    fields: [
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'Image' },
        ],
        default: 'Text',
      },
    ],
  },

  text: {
    toolbarLabel: 'Text',
    label: 'Text',
    icon: TextIcon,
    accent: '#1971C2',
    handles: [{ type: 'source', position: 'right', id: 'output' }],
    fields: [
      { key: 'text', label: 'Text', type: 'textarea', default: '{{input}}' },
    ],
    getDynamicHandles: (values) => {
      const vars = parseVariables(values.text);
      return vars.map((name, i) => ({
        type: 'target',
        position: 'left',
        id: `var-${name}`,
        label: name,
        style: { top: `${((i + 1) / (vars.length + 1)) * 100}%` },
      }));
    },
    getDynamicSize: (values) => {
      const longest = (values.text || '')
        .split('\n')
        .reduce((m, l) => Math.max(m, l.length), 0);
      const width = Math.min(560, Math.max(260, longest * 7 + 40));
      return { width };
    },
  },

  api: {
    toolbarLabel: 'API',
    label: 'API',
    icon: ApiIcon,
    accent: '#0CA678',
    handles: [
      { type: 'target', position: 'left', id: 'url', style: { top: `${100 / 3}%` } },
      { type: 'target', position: 'left', id: 'body', style: { top: `${200 / 3}%` } },
      { type: 'source', position: 'right', id: 'response' },
    ],
    fields: [
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET',
      },
      { key: 'url', label: 'URL', type: 'text', default: 'https://' },
    ],
  },

  math: {
    toolbarLabel: 'Math',
    label: 'Math',
    icon: MathIcon,
    accent: '#F08C00',
    handles: [
      { type: 'target', position: 'left', id: 'a', style: { top: `${100 / 3}%` } },
      { type: 'target', position: 'left', id: 'b', style: { top: `${200 / 3}%` } },
      { type: 'source', position: 'right', id: 'result' },
    ],
    fields: [
      {
        key: 'operation',
        label: 'Op',
        type: 'select',
        options: ['add', 'subtract', 'multiply', 'divide'],
        default: 'add',
      },
    ],
  },

  database: {
    toolbarLabel: 'Database',
    label: 'Database',
    icon: DatabaseIcon,
    accent: '#5F3DC4',
    handles: [
      { type: 'target', position: 'left', id: 'query' },
      { type: 'source', position: 'right', id: 'result' },
    ],
    fields: [
      {
        key: 'dbType',
        label: 'Type',
        type: 'select',
        options: ['SQL', 'NoSQL'],
        default: 'SQL',
      },
      { key: 'connection', label: 'Conn', type: 'text', default: '' },
    ],
  },

  filter: {
    toolbarLabel: 'Filter',
    label: 'Filter',
    icon: FilterIcon,
    accent: '#D6336C',
    handles: [
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'output' },
    ],
    fields: [
      { key: 'condition', label: 'Where', type: 'text', default: 'x > 0' },
    ],
  },

  condition: {
    toolbarLabel: 'Condition',
    label: 'Condition',
    icon: ConditionIcon,
    accent: '#0B7285',
    handles: [
      { type: 'target', position: 'left', id: 'value' },
      { type: 'source', position: 'right', id: 'true', style: { top: `${100 / 3}%` } },
      { type: 'source', position: 'right', id: 'false', style: { top: `${200 / 3}%` } },
    ],
    fields: [
      { key: 'expression', label: 'If', type: 'text', default: 'x === true' },
    ],
  },
};

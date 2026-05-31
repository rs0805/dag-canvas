import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const handleStyle = (stroke) => ({
  width: 12,
  height: 12,
  background: '#fff',
  border: `2px solid ${stroke}`,
});

const handleLabelStyle = (h, stroke) => {
  const isLeft = h.position === 'left';
  return {
    position: 'absolute',
    top: h.style?.top ?? '50%',
    transform: 'translateY(-50%)',
    [isLeft ? 'right' : 'left']: '100%',
    [isLeft ? 'marginRight' : 'marginLeft']: 10,
    fontSize: 10,
    fontFamily: 'ui-monospace, Menlo, monospace',
    color: stroke,
    background: '#fff',
    padding: '1px 6px',
    borderRadius: 4,
    border: `1px solid ${stroke}`,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  };
};

const resolveDefault = (def, id) =>
  typeof def === 'function' ? def(id) : def;

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '6px 8px',
  fontSize: 13,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
};

const AutoTextarea = ({ value, onChange }) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      style={{
        ...fieldStyle,
        resize: 'none',
        overflow: 'hidden',
        lineHeight: 1.4,
      }}
    />
  );
};

const renderField = (field, value, onChange) => {
  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyle}
      >
        {field.options.map((opt) => {
          const [val, label] =
            typeof opt === 'string' ? [opt, opt] : [opt.value, opt.label];
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    );
  }
  if (field.type === 'textarea') {
    return <AutoTextarea value={value} onChange={onChange} />;
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={fieldStyle}
    />
  );
};

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const deleteNode = useStore((s) => s.deleteNode);

  const [values, setValues] = useState(() =>
    (config.fields || []).reduce((acc, f) => {
      const fromData = data?.[f.key];
      acc[f.key] =
        fromData !== undefined ? fromData : resolveDefault(f.default, id) ?? '';
      return acc;
    }, {})
  );

  const setValue = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    updateNodeField(id, key, val);
  };

  const dynamicHandles = config.getDynamicHandles?.(values) || [];
  const allHandles = [...(config.handles || []), ...dynamicHandles];
  const targets = allHandles.filter((h) => h.type === 'target');
  const sources = allHandles.filter((h) => h.type === 'source');

  const dynamicSize = config.getDynamicSize?.(values) || {};

  const stroke = data?.stroke || config.accent || '#0F172A';
  const background = data?.background || '#ffffff';

  return (
    <div
      style={{
        position: 'relative',
        width: dynamicSize.width ?? 260,
        minHeight: 110,
        border: `2.5px solid ${stroke}`,
        borderRadius: 10,
        padding: '16px 14px 14px',
        background,
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: 12,
          background: '#ffffff',
          border: `2.5px solid ${stroke}`,
          borderRadius: 6,
          padding: '2px 10px',
          fontSize: 12,
          fontWeight: 700,
          color: stroke,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          lineHeight: 1.4,
        }}
      >
        {config.label}
      </div>

      <button
        type="button"
        className="nodrag"
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        title="Delete node"
        style={{
          position: 'absolute',
          top: -12,
          right: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#ffffff',
          border: `2px solid ${stroke}`,
          color: stroke,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.15)',
        }}
      >
        ×
      </button>

      {targets.map((h) => (
        <Fragment key={h.id}>
          <Handle
            type="target"
            position={positionMap[h.position]}
            id={`${id}-${h.id}`}
            style={{ ...handleStyle(stroke), ...h.style }}
          />
          {h.label && <div style={handleLabelStyle(h, stroke)}>{h.label}</div>}
        </Fragment>
      ))}

      {config.description && (
        <div
          style={{
            fontSize: 12,
            color: '#475569',
            marginBottom: 10,
          }}
        >
          {config.description}
        </div>
      )}

      {(config.fields || []).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {config.fields.map((f) => (
            <label
              key={f.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: 12,
                fontWeight: 500,
                color: '#334155',
              }}
            >
              {f.label}
              {renderField(f, values[f.key], (val) => setValue(f.key, val))}
            </label>
          ))}
        </div>
      )}

      {sources.map((h) => (
        <Fragment key={h.id}>
          <Handle
            type="source"
            position={positionMap[h.position]}
            id={`${id}-${h.id}`}
            style={{ ...handleStyle(stroke), ...h.style }}
          />
          {h.label && <div style={handleLabelStyle(h, stroke)}>{h.label}</div>}
        </Fragment>
      ))}
    </div>
  );
};

export const createNodeType = (config) => (props) =>
  <BaseNode {...props} config={config} />;

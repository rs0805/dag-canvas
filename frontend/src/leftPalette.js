import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeConfigs } from './nodes/nodeConfigs';

const STROKE_COLORS = [
  '#1E1E1E',
  '#E03131',
  '#2F9E44',
  '#1971C2',
  '#F08C00',
  '#6741D9',
];

const BACKGROUND_COLORS = [
  'transparent',
  '#FFC9C9',
  '#B2F2BB',
  '#A5D8FF',
  '#FFEC99',
  '#FFFFFF',
];

const selector = (state) => ({
  selectedNodeId: state.selectedNodeId,
  nodes: state.nodes,
  updateNodeStyle: state.updateNodeStyle,
});

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: '#1E1E1E',
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Swatch = ({ color, active, onClick, transparent }) => (
  <button
    type="button"
    onClick={onClick}
    title={color}
    style={{
      width: 26,
      height: 26,
      borderRadius: 6,
      border: active ? '2px solid #6965DB' : '1px solid #E7E5E4',
      background:
        transparent
          ? 'repeating-conic-gradient(#e7e5e4 0% 25%, #ffffff 0% 50%) 50% / 10px 10px'
          : color,
      cursor: 'pointer',
      padding: 0,
      outline: 'none',
      boxShadow: active ? '0 0 0 2px rgba(105,101,219,0.2)' : 'none',
      transition: 'transform 0.08s ease',
    }}
    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  />
);

export const SelectionHint = () => {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  if (selectedNodeId) return null;
  return (
    <div
      style={{
        padding: '6px 12px',
        fontSize: 12,
        color: '#9CA3AF',
        background: 'rgba(255,255,255,0.6)',
        border: '1px solid #E7E5E4',
        borderRadius: 999,
        backdropFilter: 'blur(4px)',
      }}
    >
      Select a node on the canvas to style it.
    </div>
  );
};

export const LeftPalette = () => {
  const { selectedNodeId, nodes, updateNodeStyle } = useStore(selector, shallow);

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const cfg = nodeConfigs[node.type] || {};
  const currentStroke = node.data?.stroke || cfg.accent || '#1E1E1E';
  const currentBg = node.data?.background || '#FFFFFF';

  return (
    <div
      style={{
        padding: 16,
        background: '#ffffff',
        border: '1px solid #E7E5E4',
        borderRadius: 12,
        boxShadow:
          '0 1px 2px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.06)',
        width: 200,
      }}
    >
      <Section title="Stroke">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STROKE_COLORS.map((c) => (
            <Swatch
              key={c}
              color={c}
              active={currentStroke.toLowerCase() === c.toLowerCase()}
              onClick={() => updateNodeStyle(selectedNodeId, { stroke: c })}
            />
          ))}
        </div>
      </Section>

      <Section title="Background">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BACKGROUND_COLORS.map((c) => (
            <Swatch
              key={c}
              color={c}
              transparent={c === 'transparent'}
              active={
                (currentBg || '').toLowerCase() === c.toLowerCase() ||
                (c === 'transparent' && !node.data?.background)
              }
              onClick={() => updateNodeStyle(selectedNodeId, { background: c })}
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

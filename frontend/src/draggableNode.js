import { useState } from 'react';

export const DraggableNode = ({ type, label, Icon, accent }) => {
    const [hover, setHover] = useState(false);
    const [dragging, setDragging] = useState(false);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
      setDragging(true);
    };

    const onDragEnd = (event) => {
      event.target.style.cursor = 'grab';
      setDragging(false);
    };

    const base = {
      cursor: 'grab',
      width: 36,
      height: 36,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      background: 'transparent',
      color: accent || '#44403C',
      transition:
        'background-color 0.12s ease, transform 0.08s ease, box-shadow 0.12s ease',
      userSelect: 'none',
      position: 'relative',
    };

    const hoverStyle = hover
      ? {
          background: accent ? `${accent}1A` : '#F3F4F6',
          transform: 'translateY(-1px)',
        }
      : null;

    const dragStyle = dragging
      ? {
          background: accent ? `${accent}26` : '#EEF2FF',
          boxShadow: `0 4px 12px ${accent ? `${accent}33` : 'rgba(99,102,241,0.18)'}`,
        }
      : null;

    const accentColor = accent || '#44403C';

    return (
      <div
        className={type}
        aria-label={label}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hoverStyle, ...dragStyle }}
        draggable
      >
        {Icon && <Icon size={18} />}
        {hover && !dragging && (
          <div
            role="tooltip"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.2,
              color: accentColor,
              background: '#ffffff',
              border: `1px solid ${accentColor}`,
              borderRadius: 999,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(28,25,23,0.06)',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
};

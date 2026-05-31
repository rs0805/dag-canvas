import { useState } from 'react';

export const ClickableNode = ({ type, label, Icon, accent, pendingType, onSelect }) => {
    const [hover, setHover] = useState(false);

    const selected = pendingType === type;

    const onClick = () => {
      onSelect(type);
    };

    const base = {
      cursor: 'pointer',
      width: 36,
      height: 36,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      background: 'transparent',
      color: accent || '#44403C',
      transition: 'background-color 0.12s ease, transform 0.08s ease, box-shadow 0.12s ease',
      userSelect: 'none',
      position: 'relative',
    };

    const hoverStyle = hover
      ? {
          background: accent ? `${accent}1A` : '#F3F4F6',
          transform: 'translateY(-1px)',
        }
      : null;

    const selectedStyle = selected
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
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...base, ...hoverStyle, ...selectedStyle }}
      >
        {Icon && <Icon size={18} />}
        {hover && !selected && (
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
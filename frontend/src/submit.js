import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const PARSE_ENDPOINT =`${process.env.REACT_APP_API_URL}/pipelines/parse`;

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

const Toast = ({ state, onClose }) => {
    if (state.kind === 'idle') return null;

    const shellStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 14px',
        background: '#ffffff',
        border: '1px solid #E7E5E4',
        borderRadius: 12,
        boxShadow:
            '0 1px 2px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.06)',
        fontSize: 13,
        color: '#1E1E1E',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
    };

    const title = {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        color: '#6B7280',
    };

    const divider = {
        width: 1,
        height: 18,
        background: '#E7E5E4',
    };

    const closeBtn = {
        background: 'transparent',
        border: 'none',
        color: '#9CA3AF',
        cursor: 'pointer',
        fontSize: 16,
        lineHeight: 1,
        padding: 0,
        marginLeft: 4,
    };

    if (state.kind === 'loading') {
        return (
            <div style={shellStyle}>
                <span style={title}>Parsing pipeline…</span>
            </div>
        );
    }

    if (state.kind === 'error') {
        return (
            <div style={{ ...shellStyle, borderColor: '#E03131' }}>
                <span style={{ ...title, color: '#E03131' }}>Error</span>
                <div style={divider} />
                <span>{state.message}</span>
                <button type="button" style={closeBtn} onClick={onClose}>
                    ×
                </button>
            </div>
        );
    }

    const { num_nodes, num_edges, is_dag } = state.data;
    const pillColor = is_dag ? '#2F9E44' : '#E03131';

    const stat = (label, value) => (
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ color: '#6B7280' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
        </span>
    );

    const pill = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        color: pillColor,
        background: `${pillColor}1A`,
        border: `1px solid ${pillColor}`,
        borderRadius: 999,
    };

    return (
        <div style={shellStyle}>
            <span style={title}>Pipeline parsed</span>
            <div style={divider} />
            {stat('Nodes', num_nodes)}
            {stat('Edges', num_edges)}
            <span style={pill}>{is_dag ? 'Valid DAG' : 'Not a DAG'}</span>
            <button type="button" style={closeBtn} onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [toast, setToast] = useState({ kind: 'idle' });

    useEffect(() => {
        if (toast.kind !== 'success' && toast.kind !== 'error') return;
        const id = setTimeout(() => setToast({ kind: 'idle' }), 4000);
        return () => clearTimeout(id);
    }, [toast]);

    const onSubmit = async () => {
        setToast({ kind: 'loading' });
        try {
            const response = await fetch(PARSE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const data = await response.json();
            setToast({ kind: 'success', data });
        } catch (err) {
            setToast({
                kind: 'error',
                message:
                    err?.message ||
                    'Could not reach the backend. Is it running on :8080?',
            });
        }
    };

    const isLoading = toast.kind === 'loading';

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {toast.kind !== 'idle' && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 12px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Toast
                        state={toast}
                        onClose={() => setToast({ kind: 'idle' })}
                    />
                </div>
            )}
            <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                style={{
                    padding: '10px 28px',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.3,
                    color: '#ffffff',
                    background: isLoading ? '#475569' : '#0F172A',
                    border: 'none',
                    borderRadius: 10,
                    cursor: isLoading ? 'wait' : 'pointer',
                    boxShadow:
                        '0 1px 2px rgba(15,23,42,0.12), 0 6px 18px rgba(15,23,42,0.18)',
                    transition:
                        'transform 0.05s ease, background-color 0.15s ease',
                    fontFamily: 'inherit',
                }}
                onMouseDown={(e) =>
                    !isLoading && (e.currentTarget.style.transform = 'translateY(1px)')
                }
                onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
                {isLoading ? 'Submitting…' : 'Submit'}
            </button>
        </div>
    );
};

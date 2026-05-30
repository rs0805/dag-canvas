import { DraggableNode } from './draggableNode';
import { nodeConfigs, nodeGroups } from './nodes/nodeConfigs';

export const PipelineToolbar = () => {
    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 8px',
                background: '#ffffff',
                border: '1px solid #E7E5E4',
                borderRadius: 12,
                boxShadow:
                    '0 1px 2px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.06)',
            }}
        >
            {nodeGroups.map((group, gi) => (
                <div
                    key={group.label}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {gi > 0 && (
                        <div
                            aria-hidden
                            style={{
                                width: 1,
                                height: 22,
                                background: '#E7E5E4',
                                margin: '0 6px',
                            }}
                        />
                    )}
                    {group.types.map((type) => {
                        const cfg = nodeConfigs[type];
                        if (!cfg) return null;
                        return (
                            <DraggableNode
                                key={type}
                                type={type}
                                label={cfg.toolbarLabel}
                                Icon={cfg.icon}
                                accent={cfg.accent}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

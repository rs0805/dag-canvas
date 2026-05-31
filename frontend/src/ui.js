import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeConfigs } from './nodes/nodeConfigs';
import { createNodeType } from './nodes/BaseNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = Object.fromEntries(
  Object.entries(nodeConfigs).map(([key, cfg]) => [key, createNodeType(cfg)])
);

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setSelectedNodeId: state.setSelectedNodeId,
});

export const PipelineUI = ({ pendingType, setPendingType }) => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setSelectedNodeId,
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onPaneClick = useCallback(
      (event) => {
        if (!pendingType) return;
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
    
        const nodeID = getNodeID(pendingType);
        const newNode = {
          id: nodeID,
          type: pendingType,
          position,
          data: getInitNodeData(nodeID, pendingType),
        };
        addNode(newNode);
        setPendingType(null);  
      },
      [reactFlowInstance, pendingType, setPendingType, getNodeID, addNode]
    );

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100%', height: '100%'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onPaneClick={onPaneClick}
                onSelectionChange={({ nodes: selected }) => {
                  setSelectedNodeId(selected && selected[0] ? selected[0].id : null);
                }}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                style={{ cursor: pendingType ? 'crosshair' : 'default' }}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <div
              style={{
                  position: 'absolute',
                  top: 16,
                  right: 20,
                  zIndex: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 0.1,
                  color: '#44403C',
                  pointerEvents: 'none',
              }}
          >
              Vector<span style={{ color: '#B45309' }}>Shift</span>
          </div>
        </div>
        </>
    )
}

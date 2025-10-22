import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'fetch_users' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'transform.filter' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: 'prql' } },
  { id: '4', position: { x: 0, y: 300 }, data: { label: 'log.info' } },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const DebugView = () => {
  const data = [
    { id: 1, name: 'John Doe', active: true },
    { id: 2, name: 'Jane Doe', active: false },
    { id: 3, name: 'Peter Pan', active: true },
  ];

  return (
    <div>
      <h2>Debug View</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>active</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.active.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button>Prev</button>
        <button>Next</button>
      </div>
    </div>
  );
};


const Playground = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
      );
      const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
      const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

      const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
      );

  const initialCode = `import "io/http" as http
import "core/transform" as transform

// 1. Define the shape of our data
schema User = {
    id: int,
    name: string,
    active: bool
}

// 2. Define the steps
step fetch_users -> User = http.get {
    url: "https://api.example.com/users"
}

// 3. Define the main workflow
workflow process_users {
    fetch_users
        | transform.filter { condition: "active == true" }
        | ( // 4. Use PRQL for transformation
            from input
            select name, email
          )
        | log.info
}`;

  return (
    <div>
      {/* <h1>Playground</h1> */}
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, border: '1px solid black', padding: '10px' }}>
          <h2>Code Editor</h2>
          <Editor
            height="90vh"
            defaultLanguage="heddle"
            defaultValue={initialCode}
          />
        </div>
        <div style={{ flex: 1, border: '1px solid black', padding: '10px' }}>
          <h2>DAG View</h2>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        <div style={{ flex: 1, border: '1px solid black', padding: '10px' }}>
          <DebugView />
        </div>
      </div>
    </div>
  );
};

export default Playground;

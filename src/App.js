import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';

import './index.css';
import './styles.css';

const initialNodes = [
  // {
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'input node' },
  //   position: { x: 250, y: 5 },
  // },
];

let id = 0;
const getId = () => `dndnode_${id++}`;


function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [file, setFile] = useState(null);
  const [workflowId, setWorkflowId] = useState('');
  const [workflows, setWorkflows] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error('File is required');
      return;
    }

    const formData = new FormData();

    try {
      const response = await axios.post('http://localhost:5900/execute-workflow', formData, {

        headers: {
          'Content-Type': 'multipart/form-data',
        },
        
        data: {
          workflowId: workflowId, 
          workflowData: JSON.stringify({ nodes }),
        },
      })
      console.log(response.data);
      alert("Workflow saved successfully");
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert("Error saving workflow");
    }
  };
  
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get('http://localhost:5900/workflows');
       setWorkflows(response.data.map(workflow => ({ ...workflow, id: getId() })));
      } catch (error) {
        console.error('Error fetching workflows:', error);
      }
    };
    fetchWorkflows();
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  function isAllNodeisConnected(nodes, edges) {
    console.log(nodes, edges, "is");
    const allNodesIds = nodes.map((node) => node.id);
    const allSourceEdges = edges.map((edge) => edge.source);
    let count = 0;
    for (let i = 0; i < allNodesIds.length; i++) {
      if (!allSourceEdges.includes(allNodesIds[i])) count++;
    }
    console.log(allNodesIds, allSourceEdges);
    if (count >= 2) {
      return false;
    }
    return true;
  }
  
  const saveHandler = () => {
    if (isAllNodeisConnected(nodes, edges)) alert("Congrats its correct");
    else alert("Please connect source nodes (Cannot Save Flow)");
  };

  return (
    <>
     <div>
      <input type="file" onChange={handleFileChange} />
      <select value={workflowId} onChange={(e) => setWorkflowId(e.target.value)}>
          <option value="">Select Workflow</option>
          {workflows.map((workflow) => (
            <option key={workflow.id} value={workflow.id}>
              {workflow.name}
            </option>
          ))}
        </select>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={saveHandler}>Save</button>
    </div>
    <div className="dndflow">
       
    <ReactFlowProvider>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </ReactFlowProvider>

  
  </div>
  
    </>
    
  );
}

export default App;

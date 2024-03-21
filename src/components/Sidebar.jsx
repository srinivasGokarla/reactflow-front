import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Drag nodes here:</div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, 'FilterData')}
        draggable
      >
        Filter Data
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'Wait')}
        draggable
      >
       Wait
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, 'ConvertFormat')}
        draggable
      >
        Convert Format
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'SendPOSTRequest')}
        draggable
      >
        Send POST Request
      </div>
    </aside>
  );
};

export default Sidebar;

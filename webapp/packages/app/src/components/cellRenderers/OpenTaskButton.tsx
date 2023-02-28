import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { IoMdOpen } from 'react-icons/io';

const OpenTaskButton: React.FC<ICellRendererParams> = (params) => {
  const openTask = () => {
    window.open('/annotator?taskId=' + params.data.id);
  };

  return (
    <button className="text-primary-light text-2xl align-middle" onClick={openTask}>
      <IoMdOpen />
    </button>
  );
};

export default OpenTaskButton;

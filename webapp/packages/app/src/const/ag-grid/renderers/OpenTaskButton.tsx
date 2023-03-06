import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { IoMdOpen } from 'react-icons/io';

export const OpenTaskButton = (params: ICellRendererParams) => {
  const openTask = () => {
    window.open('/annotator?taskId=' + params.data.id);
  };

  return (
    <button className="text-primary-light text-2xl align-middle" onClick={openTask}>
      <IoMdOpen />
    </button>
  );
};

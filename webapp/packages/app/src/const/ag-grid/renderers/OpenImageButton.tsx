import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { IoMdOpen } from 'react-icons/io';

export const OpenImageButton = (params: ICellRendererParams) => {
  const openImage = () => {
    window.open(`/viewer?imageInstanceIds=${params.data.id}`);
  };

  return (
    <button className="text-primary-light text-2xl align-middle" onClick={openImage}>
      <IoMdOpen />
    </button>
  );
};

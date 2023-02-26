import React from 'react';

interface ReadOnlyCheckboxParams {
  checked: boolean;
}

const ReadOnlyCheckbox = ({ checked }: ReadOnlyCheckboxParams) => {
  return <input type="checkbox" checked={checked} readOnly={true} className="h-4 w-4" />;
};

export default ReadOnlyCheckbox;

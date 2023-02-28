import { User } from '@labelstack/api';
import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';
import { useNavigate } from 'react-router';

export interface EditUserButtonProps extends ICellRendererParams {
  data: User;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ data: user }) => {
  const navigate = useNavigate();

  const editUser = () => {
    navigate(`/users/edit?userId=${user.id}`);
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <div
        className="w-full p-1 font-medium rounded-lg text-sm text-center text-dark-accent bg-dark-card-bg cursor-pointer"
        onClick={editUser}
      >
        Edit
      </div>
    </div>
  );
};

export default EditUserButton;

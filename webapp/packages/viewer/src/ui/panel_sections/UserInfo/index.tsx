import React from 'react';
import { useUserDataContext } from '@labelstack/app/src/contexts/UserDataContext';
import { BsBoxArrowRight } from 'react-icons/bs';
import PanelButton from '../../components/PanelButton';
import { useNavigate } from 'react-router';

const UserInfo: React.FC = () => {
  const [, { setUser, setToken }] = useUserDataContext();
  const [{ user }] = useUserDataContext();
  const navigate = useNavigate();

  function logout() {
    localStorage.setItem('token', '');
    setUser(undefined);
    setToken(undefined);
    navigate('/login');
  }

  return (
    <div className={'h-full w-full flex flex-col text-primary-light'}>
      <div className={'flex flex-row gap-x-2 h-8'}>
        <span className={'flex-grow place-self-center'}>Logged as {user?.email}</span>
        <PanelButton
          containerClassName={'w-6 h-6'}
          name={'Logout'}
          isActive={false}
          icon={BsBoxArrowRight}
          iconProps={{ size: 30 }}
          border={false}
          onClick={() => logout()}
        />
      </div>
    </div>
  );
};

export default UserInfo;

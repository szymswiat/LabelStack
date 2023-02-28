import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import getMenuItems, { MenuSection } from './items';
import { useUserDataContext } from '../../contexts/UserDataContext';
import classNames from 'classnames';
import LayoutCard from '@labelstack/viewer/src/components/LayoutCard';
import { useEffectNonNull } from '../../utils/hooks';

function Sidebar() {
  const navigate = useNavigate();
  const [{ user }, { setUser, setToken }] = useUserDataContext();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const location = useLocation();

  useEffectNonNull(
    () => {
      setMenuSections(getMenuItems(user.roles));
    },
    [],
    [user]
  );

  const renderIcon = (icon: IconType) => {
    const Icon: IconType = icon;
    return <Icon />;
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    navigate('/login');
  };

  return (
    <LayoutCard className="flex flex-col h-full gap-y-2 p-4">
      {menuSections.map((section, index) => (
        <div key={`section_${index}`} className="flex flex-col gap-y-2">
          <span className="font-bold mb-2 pl-2 text-lg">{section.heading}</span>
          {section.items.map((item, index) => (
            <div
              key={`section_item_${index}`}
              className={classNames(
                'h-10 flex flex-row items-center pl-2 text-base cursor-pointer rounded-lg bg-dark-bg',
                {
                  'text-dark-accent font-bold': location.pathname === item.link
                }
              )}
              onClick={() => navigate(item.link)}
            >
              <span className="text-xl text-dark-accent">{renderIcon(item.icon)}</span>
              <span className={classNames('ml-3', { 'pl-2': location.pathname === item.link })}>{item.name}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex grow" />
      <div
        className="w-full h-10 grid place-items-center cursor-pointer select-none bg-dark-bg rounded-lg"
        onClick={logout}
      >
        <span>Logout</span>
      </div>
    </LayoutCard>
  );
}

export default Sidebar;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';
import getMenuItemsForUser, { MenuSection } from './items';
import { useUserDataContext } from '../../contexts/UserDataContext';
import classNames from 'classnames';
import { useEffectNonNull } from '../../utils/hooks';
import { motion } from 'framer-motion';

function Sidebar() {
  const navigate = useNavigate();
  const [{ user }, { setUser, setToken }] = useUserDataContext();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const location = useLocation();

  useEffectNonNull(
    () => {
      setMenuSections(getMenuItemsForUser(user));
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
    <div className="flex flex-col h-full gap-y-5 p-4">
      {menuSections.map((section, index) => (
        <div key={`section_${index}`} className="flex flex-col gap-y-2">
          <span className="font-bold pl-2 text-lg">{section.heading}</span>
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
              <motion.span
                className={classNames('ml-3 select-none')}
                animate={{ x: location.pathname === item.link ? 8 : 0 }}
              >
                {item.name}
              </motion.span>
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
    </div>
  );
}

export default Sidebar;

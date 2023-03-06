import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';
import getMenuItems, { MenuSection } from './items';
import { useUserDataContext } from '../../../contexts/UserDataContext';

function Sidebar() {
  const navigate = useNavigate();
  const [{ user }, { setUser, setToken }] = useUserDataContext();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const themeMode = localStorage.getItem('theme');
    if (!themeMode || themeMode == 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  });

  useEffect(() => {
    if (user) {
      setMenuSections(getMenuItems(user.roles));
    }
  }, [user]);

  const handleThemeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    } else {
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    }
  };

  const renderIcon = (icon: IconType) => {
    const Icon: IconType = icon;
    return <Icon />;
  };

  const logout = () => {
    localStorage.setItem('token', '');
    setUser(undefined);
    setToken(undefined);
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <ul key="sidebar_menu">
        {menuSections.map((section) => (
          <ul key={'ul_section_' + section.heading}>
            <li className="font-bold dark:text-primary-light" key={section.heading}>
              <span>{section.heading}</span>
            </li>
            {section.items.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.link}
                  className={(navData) => {
                    const activeLinkClass = navData.isActive
                      ? 'bg-gray-300 dark:bg-secondary-light'
                      : 'bg-gray-100 dark:bg-secondary-active';
                    return (
                      activeLinkClass +
                      ' flex items-center rounded-lg p-2 mb-2 text-base font-normal text-gray-900 dark:text-primary-light hover:bg-gray-200 dark:hover:bg-secondary-dark'
                    );
                  }}
                >
                  <span className="text-xl">{renderIcon(item.icon)}</span>
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </ul>

      <div className="flex grow"></div>

      <div className="bottom-0 w-full">
        <label htmlFor="darkmode-toggle" className="flex relative items-center mb-4 cursor-pointer">
          <input
            type="checkbox"
            id="darkmode-toggle"
            checked={darkMode}
            className="sr-only"
            onChange={handleThemeToggle}
          />
          <div className="w-11 h-6 rounded-full border border-gray-200 bg-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600" />
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark mode</span>
        </label>

        <button
          onClick={logout}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

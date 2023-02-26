import { Role, RoleType } from '@labelstack/api';
import { IconType } from 'react-icons';
import {
  MdAssignment,
  MdBrush,
  MdBurstMode,
  MdCollectionsBookmark,
  MdCompare,
  MdPhotoAlbum,
  MdAddTask,
  MdNewLabel,
  MdRateReview
} from 'react-icons/md';

import { FaTasks, FaUserPlus, FaUsers } from 'react-icons/fa';

declare global {
  interface Array<T> {
    indexOfAny(array: T[]): number;

    containsAny(array: T[]): boolean;
  }
}

Array.prototype.indexOfAny = function (array) {
  return this.findIndex(function (v) {
    return array.indexOf(v) != -1;
  });
};

Array.prototype.containsAny = function (array) {
  return this.indexOfAny(array) != -1;
};

export interface MenuItem {
  link?: string;
  icon?: IconType;
  badge?: string;
  items?: MenuItem[];
  name: string;
  role?: RoleType[];
}

export interface MenuSection {
  items: MenuItem[];
  heading: string;
  role: RoleType[];
}

const menuItems: MenuSection[] = [
  {
    heading: 'Users',
    role: [RoleType.superuser],
    items: [
      {
        name: 'All Users',
        link: '/users/all',
        icon: FaUsers,
        role: [RoleType.superuser]
      },
      {
        name: 'Create User',
        link: '/users/create',
        icon: FaUserPlus,
        role: [RoleType.superuser]
      }
    ]
  },
  {
    heading: 'Images',
    role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin],
    items: [
      {
        name: 'All Images',
        link: '/images/all',
        icon: MdBurstMode,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Label',
        link: '/images/to-label',
        icon: MdPhotoAlbum,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Annotate',
        link: '/images/to-annotate',
        icon: MdBrush,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Review',
        link: '/images/to-review',
        icon: MdCompare,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      }
    ]
  },
  {
    heading: 'Labels',
    role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin],
    items: [
      {
        name: 'All Labels',
        link: '/labels/all',
        icon: MdCollectionsBookmark,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      }
    ]
  },
  {
    heading: 'Tasks',
    role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator],
    items: [
      {
        name: 'Unassigned',
        link: '/tasks/unassigned',
        icon: MdAddTask,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'All',
        link: '/tasks/all',
        icon: FaTasks,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Label',
        link: '/tasks/to-label',
        icon: MdNewLabel,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'To Annotate',
        link: '/tasks/to-annotate',
        icon: MdAssignment,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'To Review',
        link: '/tasks/to-review',
        icon: MdRateReview,
        role: [RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      }
    ]
  }
];

const getNestedElements = (array: MenuItem[], roles: string[]) => {
  let items: MenuItem[] = [];

  items = array.filter((item) => {
    if (item.role) {
      const itemRoles = item.role.map((role) => role.toString());
      return itemRoles.containsAny(roles);
    } else {
      return true;
    }
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, roles);
  });

  return items;
};

const getMenuItems = (roles: Role[]) => {
  const items: MenuSection[] = [];
  const roleNames = roles ? roles.map((role) => role.type) : [];

  menuItems.forEach((item) => {
    const itemRoles = item.role.map((role) => role.toString());
    if (itemRoles.containsAny(roleNames)) {
      items.push(item);
    }
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, roleNames);
  });

  return items;
};

export default getMenuItems;

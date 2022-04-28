import { Role, RoleType, User } from '@labelstack/api';
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

import { FaTasks, FaUserEdit, FaUserPlus, FaUsers } from 'react-icons/fa';

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
  roles?: RoleType[];
}

export interface MenuSection {
  items: MenuItem[];
  heading: string;
  roles: RoleType[];
}

const menuItems: MenuSection[] = [
  {
    heading: 'Users',
    roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator],
    items: [
      {
        name: 'All Users',
        link: '/users/all',
        icon: FaUsers,
        roles: [RoleType.superuser]
      },
      {
        name: 'Create User',
        link: '/users/create',
        icon: FaUserPlus,
        roles: [RoleType.superuser]
      },
      {
        name: 'Edit Profile',
        link: '/users/edit',
        icon: FaUserEdit,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      }
    ]
  },
  {
    heading: 'Images',
    roles: [RoleType.dataAdmin, RoleType.taskAdmin],
    items: [
      {
        name: 'All Images',
        link: '/images/all',
        icon: MdBurstMode,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Label',
        link: '/images/to-label',
        icon: MdPhotoAlbum,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Annotate',
        link: '/images/to-annotate',
        icon: MdBrush,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Review',
        link: '/images/to-review',
        icon: MdCompare,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      }
    ]
  },
  {
    heading: 'Labels',
    roles: [RoleType.dataAdmin, RoleType.taskAdmin],
    items: [
      {
        name: 'All Labels',
        link: '/labels/all',
        icon: MdCollectionsBookmark,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'Assign Labels',
        link: '/labels/assign',
        icon: MdCollectionsBookmark,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      }
    ]
  },
  {
    heading: 'Tasks',
    roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator],
    items: [
      {
        name: 'Unassigned',
        link: '/tasks/unassigned',
        icon: MdAddTask,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'All',
        link: '/tasks/all',
        icon: FaTasks,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'To Label',
        link: '/tasks/to-label',
        icon: MdNewLabel,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'To Annotate',
        link: '/tasks/to-annotate',
        icon: MdAssignment,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'To Review',
        link: '/tasks/to-review',
        icon: MdRateReview,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      }
    ]
  }
];

const getNestedElements = (array: MenuItem[], userRoles: RoleType[]) => {
  let items: MenuItem[] = [];

  items = array.filter((item) => {
    if (item.roles) {
      return item.roles.containsAny(userRoles) || userRoles.includes(RoleType.superuser);
    } else {
      return true;
    }
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, userRoles);
  });

  return items;
};

const getMenuItems = (user: User | null) => {
  const items: MenuSection[] = [];
  const userRoles = user ? user.roles.map((role) => role.type) : [];

  menuItems.forEach((item) => {
    const itemRoles = item.roles.map((role) => role.toString());
    if (itemRoles.containsAny(userRoles) || userRoles.includes(RoleType.superuser)) {
      items.push(item);
    }
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, userRoles);
  });

  return items;
};

export default getMenuItems;

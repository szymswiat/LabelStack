import { RoleType, User } from '@labelstack/api';
import { IconType } from 'react-icons';
import {
  MdAssignment,
  MdBurstMode,
  MdCollectionsBookmark,
  MdPhotoAlbum,
  MdAddTask,
  MdNewLabel,
  MdRateReview,
  MdAdd
} from 'react-icons/md';

import { FaTasks, FaUserEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';

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
        name: 'All',
        link: '/users/all',
        icon: FaUsers,
        roles: [RoleType.superuser]
      },
      {
        name: 'Create',
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
        name: 'All',
        link: '/images/all',
        icon: MdBurstMode,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      }
    ]
  },
  {
    heading: 'Labels',
    roles: [RoleType.dataAdmin, RoleType.taskAdmin],
    items: [
      {
        name: 'Manage',
        link: '/labels/manage',
        icon: BsPencilSquare,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin]
      },
      {
        name: 'Assign',
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
        name: 'Create',
        link: '/tasks/create',
        icon: MdAdd,
        roles: [RoleType.taskAdmin]
      },
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
        name: 'Label',
        link: '/tasks/label',
        icon: MdNewLabel,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'Annotate',
        link: '/tasks/annotate',
        icon: MdAssignment,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      },
      {
        name: 'Review',
        link: '/tasks/review',
        icon: MdRateReview,
        roles: [RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]
      }
    ]
  }
];

function getNestedElements(array: MenuItem[], userRoles: RoleType[]): MenuItem[] {
  let items: MenuItem[] = [];

  items = array.filter((item) => {
    if (item.roles) {
      return item.roles.containsAny(userRoles) || userRoles.includes(RoleType.superuser);
    } else {
      return true;
    }
  });

  items = items.map((item) => {
    return { ...item };
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, userRoles);
  });

  return items;
}

function getMenuItems(user: User | null): MenuSection[] {
  let items: MenuSection[] = [];
  const userRoles = user ? user.roles.map((role) => role.type) : [];

  menuItems.forEach((item) => {
    const itemRoles = item.roles.map((role) => role.toString());
    if (itemRoles.containsAny(userRoles) || userRoles.includes(RoleType.superuser)) {
      items.push(item);
    }
  });

  items = items.map((item) => {
    return { ...item };
  });

  items.forEach((item) => {
    if (item.items) item.items = getNestedElements(item.items, userRoles);
  });

  return items;
}

export default getMenuItems;

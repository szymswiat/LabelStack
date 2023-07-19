import React, { ExoticComponent, lazy, Suspense } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import SidebarLayout from '../layouts/SidebarLayout';
import BaseLayout from '../layouts/BaseLayout';
import PrivateWrapper from './PrivateWrapper';
import Error from '../content/pages/Error';
import { RoleType } from '@labelstack/api';

const Loader = (Component: ExoticComponent) => (props: any) =>
  (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );

// Login
const Login = Loader(lazy(() => import('../content/pages/Login')));

// Images
const AllImages = Loader(lazy(() => import('../content/pages/images/AllImages')));

// Labels
const ManageLabels = Loader(lazy(() => import('../content/pages/labels/ManageLabels')));
const AssignLabels = Loader(lazy(() => import('../content/pages/labels/AssignLabels')));

// Tasks
const UnassignedTasks = Loader(lazy(() => import('../content/pages/tasks/UnassignedTasks')));
const AllTasks = Loader(lazy(() => import('../content/pages/tasks/AllTasks')));
const LabelTasks = Loader(lazy(() => import('../content/pages/tasks/LabelTasks')));
const AnnotationTasks = Loader(lazy(() => import('../content/pages/tasks/AnnotationTasks')));
const AnnotationReviewTasks = Loader(lazy(() => import('../content/pages/tasks/AnnotationReviewTasks')));
const CreateLabelTask = Loader(lazy(() => import('../content/pages/tasks/CreateLabelTask')));
const CreateAnnotationTask = Loader(lazy(() => import('../content/pages/tasks/CreateAnnotationTask')));
const CreateAnnotationReviewTask = Loader(lazy(() => import('../content/pages/tasks/CreateAnnotationReviewTask')));

// Users
const AllUsers = Loader(lazy(() => import('../content/pages/users/AllUsers')));
const EditUser = Loader(lazy(() => import('../content/pages/users/EditUser')));
const CreateUser = Loader(lazy(() => import('../content/pages/users/CreateUser')));

const ViewerApp = Loader(lazy(() => import('@labelstack/viewer')));
const AnnotatorApp = Loader(lazy(() => import('@labelstack/annotator')));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="images/all" />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Error />
          }
        ]
      },
      {
        path: 'error',
        element: <BaseLayout />,
        children: [
          {
            path: '',
            element: <Error />
          }
        ]
      },
      {
        path: '*',
        element: <Error />
      }
    ]
  },
  {
    path: 'images',
    element: (
      <PrivateWrapper>
        <SidebarLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="images/all" replace />
      },
      {
        path: 'all',
        element: (
          <PrivateWrapper roles={[RoleType.taskAdmin, RoleType.dataAdmin]}>
            <AllImages />
          </PrivateWrapper>
        )
      }
    ]
  },
  {
    path: 'labels',
    element: (
      <PrivateWrapper>
        <SidebarLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="labels/manage" replace />
      },
      {
        path: 'manage',
        element: (
          <PrivateWrapper roles={[RoleType.taskAdmin, RoleType.dataAdmin]}>
            <ManageLabels />
          </PrivateWrapper>
        )
      },
      {
        path: 'assign',
        element: (
          <PrivateWrapper roles={[RoleType.taskAdmin, RoleType.dataAdmin]}>
            <AssignLabels />
          </PrivateWrapper>
        )
      }
    ]
  },
  {
    path: 'tasks',
    element: (
      <PrivateWrapper>
        <SidebarLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="tasks/all" replace />
      },
      {
        path: 'create',
        element: (
          <PrivateWrapper roles={[RoleType.taskAdmin]}>
            <Outlet />
          </PrivateWrapper>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="/tasks/create/label" replace />
          },
          {
            path: 'label',
            element: <CreateLabelTask />
          },
          {
            path: 'annotation',
            element: <CreateAnnotationTask />
          },
          {
            path: 'review',
            element: <CreateAnnotationReviewTask />
          }
        ]
      },
      {
        path: 'label',
        element: <LabelTasks />
      },
      {
        path: 'annotate',
        element: <AnnotationTasks />
      },
      {
        path: 'review',
        element: <AnnotationReviewTasks />
      },
      {
        path: 'unassigned',
        element: <UnassignedTasks />
      },
      {
        path: 'all',
        element: <AllTasks />
      }
    ]
  },
  {
    path: 'users',
    element: (
      <PrivateWrapper>
        <SidebarLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="users/all" replace />
      },
      {
        path: 'all',
        element: (
          <PrivateWrapper roles={[RoleType.superuser]}>
            <AllUsers />
          </PrivateWrapper>
        )
      },
      {
        path: 'edit',
        element: (
          <PrivateWrapper roles={[RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]}>
            <EditUser />
          </PrivateWrapper>
        )
      },
      {
        path: 'create',
        element: (
          <PrivateWrapper roles={[RoleType.superuser]}>
            <CreateUser />
          </PrivateWrapper>
        )
      }
    ]
  },
  {
    path: 'viewer',
    element: (
      <PrivateWrapper>
        <BaseLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <ViewerApp />
      }
    ]
  },
  {
    path: 'annotator',
    element: (
      <PrivateWrapper>
        <BaseLayout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '',
        element: <AnnotatorApp />
      }
    ]
  }
];

export default routes;

import React, { ExoticComponent, lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import SidebarLayout from '../layouts/SidebarLayout';
import BaseLayout from '../layouts/BaseLayout';
import PrivateWrapper from './PrivateWrapper';
import ErrorPage from '../content/pages/ErrorPage';
import { RoleType, TaskType } from '@labelstack/api';

const Loader = (Component: ExoticComponent) => (props: any) =>
  (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );

// Login
const Login = Loader(lazy(() => import('../content/pages/Login')));

// Images
const ImagesToLabel = Loader(lazy(() => import('../content/tables/Images/ImagesToLabel')));
const ImagesToAnnotate = Loader(lazy(() => import('../content/tables/Images/ImagesToAnnotate')));
const ImagesToReview = Loader(lazy(() => import('../content/tables/Images/ImagesToReview')));
const AllImages = Loader(lazy(() => import('../content/tables/Images/AllImages')));

// Labels
const AllLabels = Loader(lazy(() => import('../content/tables/Labels/AllLabels')));

// Tasks
const TasksTable = Loader(lazy(() => import('../content/tables/Tasks')));

// Users
const AllUsers = Loader(lazy(() => import('../content/users/AllUsers')));
const EditUser = Loader(lazy(() => import('../content/users/EditUser')));
const CreateUser = Loader(lazy(() => import('../content/users/CreateUser')));

const ViewerApp = Loader(lazy(() => import('@labelstack/viewer')));
const AnnotatorApp = Loader(lazy(() => import('@labelstack/annotator')));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="images/to-label" />
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
            element: <ErrorPage />
          }
        ]
      },
      {
        path: 'error',
        element: <BaseLayout />,
        children: [
          {
            path: '',
            element: <ErrorPage />
          }
        ]
      },
      {
        path: '*',
        element: <ErrorPage />
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
        element: <Navigate to="images/to-label" replace />
      },
      {
        path: 'to-label',
        element: (
          <PrivateWrapper roles={[RoleType.superuser, RoleType.taskAdmin]}>
            <ImagesToLabel />
          </PrivateWrapper>
        )
      },
      {
        path: 'to-annotate',
        element: (
          <PrivateWrapper roles={[RoleType.superuser, RoleType.taskAdmin]}>
            <ImagesToAnnotate />
          </PrivateWrapper>
        )
      },
      {
        path: 'to-review',
        element: (
          <PrivateWrapper roles={[RoleType.superuser, RoleType.taskAdmin]}>
            <ImagesToReview />
          </PrivateWrapper>
        )
      },
      {
        path: 'all',
        element: (
          <PrivateWrapper roles={[RoleType.superuser, RoleType.taskAdmin, RoleType.dataAdmin]}>
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
        element: <Navigate to="labels/all" replace />
      },
      {
        path: 'all',
        element: (
          <PrivateWrapper roles={[RoleType.superuser, RoleType.taskAdmin, RoleType.dataAdmin]}>
            <AllLabels />
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
        path: 'to-label',
        element: <TasksTable taskType={TaskType.labelAssignment} />
      },
      {
        path: 'to-annotate',
        element: <TasksTable taskType={TaskType.annotation} />
      },
      {
        path: 'to-review',
        element: <TasksTable taskType={TaskType.annotationReview} />
      },
      {
        path: 'unassigned',
        element: <TasksTable taskType={undefined} unassigned={true} />
      },
      {
        path: 'all',
        element: <TasksTable taskType={undefined} />
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
          <PrivateWrapper roles={[RoleType.superuser, RoleType.dataAdmin, RoleType.taskAdmin, RoleType.annotator]}>
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

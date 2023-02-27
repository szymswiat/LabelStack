import React, { ExoticComponent, lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

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
const ImagesToLabel = Loader(lazy(() => import('../content/pages/images/ImagesToLabel')));
const ImagesToAnnotate = Loader(lazy(() => import('../content/pages/images/ImagesToAnnotate')));
const ImagesToReview = Loader(lazy(() => import('../content/pages/images/ImagesToReview')));
const AllImages = Loader(lazy(() => import('../content/pages/images/AllImages')));

// Labels
const AllLabels = Loader(lazy(() => import('../content/pages/labels/AllLabels')));

// Tasks
const UnassignedTasks = Loader(lazy(() => import('../content/pages/tasks/UnassignedTasks')));
const AllTasks = Loader(lazy(() => import('../content/pages/tasks/AllTasks')));
const LabelTasks = Loader(lazy(() => import('../content/pages/tasks/LabelTasks')));
const AnnotationTasks = Loader(lazy(() => import('../content/pages/tasks/AnnotationTasks')));
const AnnotationReviewTasks = Loader(lazy(() => import('../content/pages/tasks/AnnotationReviewTasks')));

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
        element: <LabelTasks />
      },
      {
        path: 'to-annotate',
        element: <AnnotationTasks />
      },
      {
        path: 'to-review',
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

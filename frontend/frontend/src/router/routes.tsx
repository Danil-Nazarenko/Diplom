import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import Layout from '../layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MainPage from '../pages/MainPage';
import TasksPage from '../pages/TasksPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/main',
  component: MainPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$topicId',
  component: TasksPage,
});


export { tasksRoute };

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    registerRoute,
    mainRoute,
    tasksRoute,
  ]),
});

import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from '../layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage'; // Импорт страницы регистрации

const rootRoute = createRootRoute({
  component: Layout,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([loginRoute, registerRoute]), // Добавляем маршрут регистрации
});

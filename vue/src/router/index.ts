import { createRouter, createWebHistory } from 'vue-router'
import VentasView from '../views/VentasView.vue'
import InventarioView from '../views/InventarioView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import GastosView from '../views/GastosView.vue' // <-- IMPORTAMOS GASTOS
import ClienteView from '../views/ClienteView.vue' // <-- IMPORTAMOS CLIENTE
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ReportesDashboard from '../views/ReportesDashboard.vue'
import ReportesView from '../views/ReportesView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ConfiguracionView from '../views/ConfiguracionView.vue'
import DeliveryView from '../views/DeliveryView.vue'
import VentasWebView from '../views/VentasWebView.vue'
import MantenimientosView from '../views/MantenimientosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ventas',
      name: 'ventas',
      component: VentasView
    },
    {
      path: '/ventas-web',
      name: 'ventas-web',
      component: VentasWebView
    },
    {
      path: '/',
      name: 'home',
      component: LoginView // Se manejará por el guard
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView
    },
    {
      path: '/gastos',
      name: 'gastos',
      component: GastosView
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: ClienteView
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: ReportesView
    },
    {
      path: '/mis-ventas',
      name: 'mis-ventas',
      component: ReportesView
    },
    {
      path: '/analitica',
      name: 'analitica',
      component: ReportesDashboard
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: ConfiguracionView
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: DeliveryView
    },
    {
      path: '/mantenimientos',
      name: 'mantenimientos',
      component: MantenimientosView
    }
  ]
})

router.beforeEach((to, from) => {
  const rol = sessionStorage.getItem('rolUsuario');

  // 1. Redirección desde el Home según el rol
  if (to.path === '/') {
    if (!rol) return '/login';
    if (rol === 'admin') return '/admin';
    if (rol === 'cajero') return '/ventas';
    if (rol === 'cliente') return '/cliente';
    if (rol === 'delivery') return '/delivery';
  }

  // 2. Si ya está logueado, no puede entrar a /login
  if (to.path === '/login' && rol) {
    return '/';
  }

  // 3. Definición de permisos por ruta
  const routesPermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/usuarios': ['admin'],
    '/gastos': ['admin'],
    '/reportes': ['admin'],
    '/analitica': ['admin'],
    '/mis-ventas': ['cajero'],
    '/inventario': ['admin'],
    '/mantenimientos': ['admin'],
    '/ventas': ['cajero'],
    '/ventas-web': ['cajero'],
    '/delivery': ['delivery', 'admin'],
    '/cliente': ['cliente'],
    '/configuracion': ['admin', 'cajero', 'delivery', 'cliente']
  };

  const allowedRoles = routesPermissions[to.path];

  // Si la ruta está protegida y el rol no está en los permitidos
  if (allowedRoles && (!rol || !allowedRoles.includes(rol))) {
    console.warn(`Acceso denegado a ${to.path} para el rol ${rol}`);
    return rol ? '/' : '/login';
  }

  // Navegación permitida
  return true;
})

export default router
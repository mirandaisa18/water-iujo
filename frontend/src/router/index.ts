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
import { useSistemaStore } from '../stores/sistema'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ventas',
      name: 'ventas',
      component: VentasView,
      meta: { requiresAuth: true, roles: ['cajero'] }
    },
    {
      path: '/ventas-web',
      name: 'ventas-web',
      component: VentasWebView,
      meta: { requiresAuth: true, roles: ['cajero'] }
    },
    {
      path: '/',
      name: 'home',
      component: LoginView
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { requiresAuth: true, roles: ['admin', 'cajero'] }
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
      component: AdminDashboardView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/gastos',
      name: 'gastos',
      component: GastosView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: ClienteView,
      meta: { requiresAuth: true, roles: ['cliente'] }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: ReportesView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/mis-ventas',
      name: 'mis-ventas',
      component: ReportesView,
      meta: { requiresAuth: true, roles: ['cajero'] }
    },
    {
      path: '/analitica',
      name: 'analitica',
      component: ReportesDashboard,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: ConfiguracionView,
      meta: { requiresAuth: true, roles: ['admin', 'cajero', 'delivery', 'cliente'] }
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: DeliveryView,
      meta: { requiresAuth: true, roles: ['delivery', 'admin'] }
    },
    {
      path: '/mantenimientos',
      name: 'mantenimientos',
      component: MantenimientosView,
      meta: { requiresAuth: true, roles: ['admin'] }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const store = useSistemaStore();

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!store.isAuthenticated) {
      return '/login';
    }

    // Verificar roles
    const allowedRoles = to.meta.roles as string[];
    if (allowedRoles && !allowedRoles.includes(store.rolUsuario)) {
      console.warn(`Acceso denegado a ${to.path} para el rol ${store.rolUsuario}`);
      return '/';
    }
  }

  // Si ya está autenticado, redirigir desde login
  if (to.path === '/login' && store.isAuthenticated) {
    if (store.rolUsuario === 'admin') return '/admin';
    if (store.rolUsuario === 'cajero') return '/ventas';
    if (store.rolUsuario === 'cliente') return '/cliente';
    if (store.rolUsuario === 'delivery') return '/delivery';
    return '/';
  }

  // Redirección desde home según rol
  if (to.path === '/' && store.isAuthenticated) {
    if (store.rolUsuario === 'admin') return '/admin';
    if (store.rolUsuario === 'cajero') return '/ventas';
    if (store.rolUsuario === 'cliente') return '/cliente';
    if (store.rolUsuario === 'delivery') return '/delivery';
  }

  return true;
})

export default router
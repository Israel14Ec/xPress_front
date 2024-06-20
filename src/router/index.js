import {createRouter, createWebHistory } from 'vue-router'
import {useAuthStore } from '../stores/auth'
import {useToast} from 'vue-toast-notification';
import HomeView from '../views/HomeView.vue'
import Adminlayout from '../views/admin/Adminlayout.vue'
import JobLayout from '../views/admin/JobManage/JobLayout.vue'
import OrdersInventaryLayout from '../views/admin/OrdersInventary/OrdersInventaryLayout.vue'
import HeadLayout from '../views/HeadDepartment/HeadLayout.vue'
import HomeDepLayout from '../views/HeadDepartment/HomePage/HomeDepLayout.vue'
import JobEmployeeLayout from '../views/Employee/JobManage/JobEmployeeLayout.vue'
import EmployeeLayout from '../views/Employee/EmployeeLayout.vue'
import AuthApi from '../api/AuthApi'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'login',
          component: () => import ('../views/Home/LoginView.vue')
        },
        {
          path: 'registrarse',
          name: 'createAccount',
          component: () => import('../views/Home/CreateAccount.vue')

        },
        {
          path: 'recuperar_pass',
          name: 'forgetPassword',
          component: () => import('../views/Home/ForgetPassword.vue')

        }
      ],
    },
    {
      path: '/reestablecer_pass/:token',
      name: 'NewPassword',
      component: () => import('../views/Home/NewPassword.vue')
    },
    
    //Pagina de Error
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../views/Utils/NotFound.vue')
    },

    //RUTAS PROTEGIDAS DE ADMIN
    {
      path: '/admin',
      name: 'admin',
      component: Adminlayout,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'inicio',
          name: 'HomePageAdmin', 
          component: () => import ('../views/admin/HomePage.vue')
        },
        {
          path: 'editar_perfil',
          name: 'EditProfile',
          component: () => import('../views/Utils/EditProfile.vue')
        },
        {
          path: 'trabajos',
          name: 'JobLayout',
          component: JobLayout,
          children: [
            {
              path: '',
              name: 'JobHome',
              component: () => import('../views/admin/JobManage/JobHome.vue')
            },
            
            {
              path: 'add',
              name: 'AddJob',
              component: () => import('../views/admin/JobManage/AddJob.vue')
            },
            {
              path: 'edit/:id',
              name: 'JobEdit',
              component: () => import('../views/admin/JobManage/JobEdit.vue')
            },
            {
              path: 'asignar_departamento/:id',
              name: 'DepartmentAssing',
              component: () => import ('../views/admin/JobManage/DepartmentAssing.vue')
            },
            {
              path: 'todos_trabajos',
              name: 'AllJobAdmin',
              component: () => import ('../views/admin/JobManage/AllJob.vue')
            },
            {
              path: 'detalles/:id',
              name: 'JobFinishDetailsAdmin',
              component: () => import ('../views/admin/JobManage/JobFinishDetails.vue')
            }

        ]
        },
        {
          path: 'configuraciones_gestion',
          name: 'ConfigAdmin',
          component: () => import ('../views/admin/configManage/ConfigLayout.vue'),
          children: [
            {
              path: 'mantenimiento_tipo',
              name: 'MaintenanceType',
              component: () => import ('../views/admin/configManage/MaintenanceType.vue')
            },
            {
              path: 'estados_trabajo',
              name: 'JobStatus',
              component: () => import ('../views/admin/configManage/JobStatus.vue')
            },
            {
              path: 'prioridades_trabajo',
              name: 'JobPriorities',
              component: () => import ('../views/admin/configManage/JobPriorities.vue')
            },
            {
              path: 'clientes',
              name: 'Clients',
              component: () => import ('../views/admin/configManage/Clients.vue')
            },
            {
              path: 'comunicacion_tipo',
              name: 'CommunicationType',
              component: () => import('../views/admin/configManage/CommunicationType.vue')
            },
            {
              path: 'administrar_departamentos',
              name: 'departmentManage',
              component: () => import ('../views/admin/configManage/DepartmentManage.vue')
            },

          ]
        },
        {
          path: 'seguimiento_trabajos',
          name: 'JobsTrackingAdmin',
          component: () => import ('../views/admin/JobTracking.vue')  
        },
        {
          path: 'material',
          name: 'MaterialManageAdmin',
          component: () => import('../views/admin/MaterialManage/MaterialLayout.vue'),
          children: [
            {
              path: '', 
              name: 'MaterialHome',
              component: () => import('../views/admin/MaterialManage/MaterialHome.vue'),
            },
            {
              path: 'add', 
              name: 'MaterialAdd',
              component: () => import('../views/admin/MaterialManage/MaterialAdd.vue'),
            },
            {
              path: 'edit/:id',
              name: 'MaterialEdit',
              component: () => import('../views/admin/MaterialManage/MaterialEdit.vue')
            },
            {
              path: 'magnitudes',
              name: 'MagnitudeMaterial',
              component: () => import('../views/admin/MaterialManage/MagnitudeMaterial.vue')
            },
            {
              path: 'stock_historial/:id',
              name: 'StockHistory',
              component: () => import('../views/admin/MaterialManage/StockHistory.vue')
            },
            
          ]
        },
        
        {
          path: 'equipos',
          name: 'EquipmentManageAdmin',
          component: () => import ('../views/admin/EquipmentManage/EquipmentLayout.vue') ,
          children: [
            {
              path: '',
              name: 'EquipmentHome',
              component: () => import('../views/admin/EquipmentManage/EquipmentHome.vue')
            },
            {
              path: 'add',
              name: 'EquipmentAdd',
              component: () => import('../views/admin/EquipmentManage/EquipmentAdd.vue')
            },
            {
              path: 'edit/:id',
              name: 'EquipmentEdit',
              component: () => import('../views/admin/EquipmentManage/EquipmentEdit.vue')

            },
            {
              path: 'tipos_equipos',
              name: 'TypeEquipment',
              component: () => import('../views/admin/EquipmentManage/EquipmentType.vue')
            },
            {
              path: 'estados_equipos',
              name: 'StatusEquipment',
              component: () => import('../views/admin/EquipmentManage/EquipmentStatus.vue')
            }
    
          ]
        },
        {
          path: 'pedidos_inventario',
          name: 'ordersLayout',
          component: OrdersInventaryLayout,
          children: [
            {
              path: '',
              name: 'ordersAdmin',
              component: () => import('../views/admin/OrdersInventary/OrdersInventary.vue')
            },
            {
              path: 'historial_ordenes',
              name: 'historyOrdersAdmin',
              component: () => import('../views/admin/OrdersInventary/HistoryOrders.vue')
            },
            {
              path: 'confirmar_orden_material/:id',
              name: 'confirmMaterialOrder',
              component: () => import('../views/admin/OrdersInventary/MaterialOrdersConfirm.vue')
            },
            {
              path: 'confirmar_orden_equipo/:id',
              name: 'ConfirmEquipmentOrder',
              component: () => import('../views/admin/OrdersInventary/EquipmentOrdersConfirm.vue')
            },
            {
              path: 'retiro_inventario',
              name: 'SurplusIneventory',
              component: () => import('../views/admin/OrdersInventary/SurplusInventory.vue')
            }
          ]
        },
        {
          path: 'asignacion_roles',
          name: 'RoleAssignAdmin',
          component: () => import ('../views/admin/RoleAssign.vue')  
        },
        {
          path: 'informes',
          name: 'reportAdmin',
          component: () => import ('../views/admin/Report.vue')  
        },
        {
          path: 'administrar_locales',
          name: 'shopManage',
          component: () => import ('../views/admin/ShopManage.vue')
        },

      ]
    },

    //RUTAS PROTEGIDAS DE JEFE DE DEPARTAMENTO
    {
      path: '/jefe_departamento',
      name: 'DepartmentLayout',
      component: HeadLayout,
      meta: {requiresHeadDepartment: true},
      children: [
        {
          path: '',
          name: 'HomeDepLayout',
          component: HomeDepLayout,
          children: [
            {
              path: '',
              name: 'HomeDepartment',
              component: () => import('../views/HeadDepartment/HomePage/HomeDepartment.vue'),
            },
            {
              path: 'asignar_recursos/:id',
              name: 'AssignResourcesHead',
              component: () => import('../views/HeadDepartment/HomePage/AssignResources.vue')
            },
          ]
        },

        {
          path: 'editar_perfil_jefe',
          name: 'editProfileHead',
          component: () => import('../views/Utils/EditProfile.vue')
        },
       
        {
          path: 'asignar_rol',
          name: 'AssignRolHead',
          component: () => import('../views/HeadDepartment/RolWorkers.vue')
        },
        {
          path: 'ordenes_trabajo',
          name: 'ReportJobLayout',
          component: () => import('../views/HeadDepartment/ReportJob/ReportJobLayout.vue'),
          children:[
            {
              path: 'en_progreso',
              name: 'JobInProgressHead',
              component: () => import('../views/HeadDepartment/ReportJob/WorkInProgress.vue')
            },
            {
              path: 'historial',
              name: 'ReportJob',
              component: () => import('../views/HeadDepartment/ReportJob/ReportJob.vue')
            },
            {
              path: 'orden_trabajo/:id',
              name: 'ViewCompleteWorkHead',
              component: () => import('../views/HeadDepartment/ReportJob/ViewCompleteWorkHead.vue')
            },
            {
              path: 'editar_orden_completa/:id',
              name: 'EditReportJobEmployee',
              component: () => import('../views/HeadDepartment/ReportJob/EditReportJob.vue')
            },
            {
              path: 'editar_orden/:id',
              name: 'EditWorkOrderHead',
              component: () => import('../views/HeadDepartment/ReportJob/EditWorkOrder.vue')
            }
          ]
        },
      ]
    },

    //RUTAS PROTEGIDAS DE TRABAJADOR
    {
      path: '/trabajador',
      name: 'EmployeeLayout',
      component: EmployeeLayout,
      meta: {requiresEmployee: true},
      children: [
        {
          path: '',
          name: 'HomeEmployee',
          component: () => import('../views/Employee/HomeEmployee.vue')
        },
        {
          path: 'editar_perfil_empleado',
          name: 'EditProfileEmployee',
          component: () => import('../views/Utils/EditProfile.vue')
        },
        {
          path: 'trabajos',
          name: 'JobEmployeeLayout',
          component: JobEmployeeLayout,
          children: [
            {
              path: '',
              name: 'WorkLayoutEmployee',
              component: () => import('../views/Employee/JobManage/WorkLayout.vue'),
              children: [
                {
                  path: 'en_progreso',
                  name: 'WorkProgressEmployee',
                  component: () => import('../views/Employee/JobManage/WorkInProgress.vue')
                },
                {
                  path: 'historial',
                  name: 'WorkHistoryEmployee',
                  component: () => import('../views/Employee/JobManage/WorkHistory.vue')
                }, 
                {
                  path: 'visualizar_trabajo/:id',
                  name: 'ViewCompleteJobEmployee',
                  component: () =>  import('../views/Employee/JobManage/ViewCompleteJob.vue')
                },
                {
                  path: 'editar/:id',
                  name: 'EditCompleteJobEmployee',
                  component: () =>  import('../views/Employee/JobManage/EditCompleteJob.vue')
                }
              ]
            },
           
            {
              path: 'completo/:id',
              name: 'CompleteJobEmployee',
              component: () => import('../views/Employee/JobManage/CompleteJob.vue')
            }
          ]
        },

      ]
    },

  ]
})

router.beforeEach(async (to, from, next) => {
  
  const use = useAuthStore()
  const toast = useToast();
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  const requiresHeadDepartment = to.matched.some(url => url.meta.requiresHeadDepartment)  
  const requiresEmployee = to.matched.some(url => url.meta.requiresEmployee)

  if (requiresAuth || requiresHeadDepartment || requiresEmployee) {

    try {

      const response = await AuthApi.userProfile()
      const data  = response.data.msg
      use.userData = data //Guardo los datos en mi store
      
      switch (data.id_rol) {
        case 1: //Admin
          next()
          break
        
        case 2: //Jefe de departamento
          if (requiresHeadDepartment || to.name === 'HomeDepartment') {
            next(); 
          } else {
            next({ name: 'HomeDepartment' }); 
          }
        break;

        case 3: //Empleado
          if(requiresEmployee || to.name === 'HomeEmployee') {
            next()
          } else {
            next({name: 'HomeEmployee'})
          }
          break
        
        case 4:
          localStorage.removeItem('AUTH_TOKEN') //Reinicia el token del storage
          toast.open({
            message: 'Espere que un administrador confirme su cuenta',
            type: 'warning',
            position: 'top-right'
          })
          next({ name: 'login' })
          break

        case 5:
          localStorage.removeItem('AUTH_TOKEN') 
          toast.open({
            message: 'Se le quito el acceso a la aplicación',
            type: 'warning',
            position: 'top-right'
          })
          next({ name: 'login' })
          break
      }

    } catch (error) {
      console.error(error)
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
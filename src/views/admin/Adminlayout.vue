<template>

   <!--VISTA PARA MOVILES-->
  <div v-if="mobile">
    <header class="mb-20">
      <div class="bg-gray-700 py-3 fixed top-0 left-0 right-0 shadow-md">

        <!--Sección de notificaciones-->
        <div class="relative ">
          <div class="flex justify-between items-start">
            <Bars4Icon @click="isVisible" class="ml-4 w-5 text-white cursor-pointer" />
            <div class="relative">
              <div class="relative inline-block mr-5 cursor-pointer">
                  <BellAlertIcon class="w-6 text-white hover:text-blue-300" 
                    @click="selectNotify"
                  />
                  <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500">
                    {{ notification.countNotify }}
                  </span>
                </div>
            </div>
          </div>
        </div>

          <!--NOTIFICACIONES-->
          <div  v-if="isSelectNotify">
          <div class="absolute top-16 right-3 z-10">
            <div class="bg-gray-50 shadow-2xl rounded-lg max-h-96 w-96 p-5 overflow-y-auto">
              <div class="flex justify-between">
                <h3 class="text-gray-700 font-semibold text-lg">Notificaciones</h3>
                  <XMarkIcon 
                    class="w-5 cursor-pointer"
                    @click="selectNotify"  
                  />
              </div>

              <div class="flex gap-3 text-blue-500 cursor-pointer mt-2 text-sm ">
                <p :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 1 }"
                  @click="select = 1"
                >No Leidas</p>
                <p :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 2 }"
                  @click="select = 2"
                >Leidas</p>
              </div>
              
              <!--NOTIFICACIONES NO LEIDAS-->
              <div v-if="select == 1">
                <div v-if="notify.length > 0">
                    <CardNotification 
                      v-for="noty in notify"
                      :key="noty.id" 
                      :notify="noty" 
                      :is-delete="false"
                    />
                </div>

                <div v-else>
                  <p class="text-center mt-5 text-sm text-red-500">No hay notificaciones recientes</p>
                </div>
              </div>

              <!--NOTIFICACIONES LEIDAS-->
              <div v-if="select == 2">  
                <div v-if="notifyRead.length > 0">
                    <CardNotification 
                      v-for="noty in notifyRead"
                      :key="noty.id" 
                      :notify="noty" 
                      :is-delete="true"
                    />
                </div>
                <div v-else>
                  <p class="text-center mt-5 text-sm text-red-500">No hay notificaciones</p>
                </div>
              </div>

            </div>
          </div>
        </div>
       

        <div v-if="visible" class="bg-gray-100/80 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm z-0"
          @click="isVisible"></div>

        <div v-if="visible" class="bg-gray-800 min-h-screen w-80 fixed top-0 left-0">
          <div class="pt-3">
            <button class="ml-4 mt-4 text-gray-800" @click="isVisible">
              <XMarkIcon class="w-5 text-white" />
            </button>
            <div>
              <img src="../../assets/img/LogoWhite.png" class="h-16 mx-auto" alt="Logo white" />
              <h2 class="text-center text-yellow-400 text-4xl font-bold">
                xPress
              </h2>
            </div>
            <div class="text-center">
              <IconRoute v-for="option in optionsFirst" :key="option.name" :to="option.nameRoute">
                <component :is="option.icon" />
                <template #text>
                  {{ option.name }} 
                </template>
              </IconRoute>

              <DropDownButton :isSelect="dropDown2">
                <Squares2X2Icon />
                <template #text>Manejo de Inventario</template>
                <template #option>
                  <IconRoute v-for="option in optionStock" :key="option.name" :to="option.nameRoute"
                    :parent="option.parent">
                    <component :is="option.icon" />
                    <template #text>
                      {{ option.name }}
                    </template>
                  </IconRoute>
                </template>
              </DropDownButton>

              <IconRoute v-for="option in optionsPanel" :key="option.name" :to="option.nameRoute"
                :parent-route-name="'admin'" :parent="option.parent" @click="isVisible">

                <component :is="option.icon" />
                <template #text>
                  {{ option.name }}
                </template>
              </IconRoute>
            </div>
            <footer class="absolute bottom-5">
              <FooterPanel 
                name-route="EditProfile"
              />
            </footer>
          </div>
        </div>
      </div>
    </header>
    <main class="mt-10" :class="{ 'relative -z-10': visible }">
      <RouterView>
      </RouterView>
    </main>
  </div>

  <div v-else>
    <div class="flex flex-row">
      <div class="bg-gray-800 w-72 h-screen fixed top-0 left-0 shadow-md">
        <div class="relative mt-4">
          <img src="../../assets/img/LogoWhite.png" class="mx-auto h-20" alt="Logo white" />
          <h2 class="text-center text-yellow-400 text-2xl font-bold mb-4">
            xPress
          </h2>

          <IconRoute v-for="option in optionsFirst" :key="option.name" :to="option.nameRoute" :parent-route-name="'admin'"
            :parent="option.parent ?? ''">
            <component :is="option.icon" />
            <template #text>
              {{ option.name }}
            </template>
          </IconRoute>

          <DropDownButton :isSelect="dropDown2">
            <Squares2X2Icon />
            <template #text>Manejo de Inventario</template>
            <template #option>
              <IconRoute v-for="option in optionStock" :key="option.name" :to="option.nameRoute" :parent="option.parent">
                <component :is="option.icon" />
                <template #text>
                  {{ option.name }}
                </template>
              </IconRoute>
            </template>
          </DropDownButton>

          <IconRoute v-for="option in optionsPanel" :key="option.name" :to="option.nameRoute" :parent-route-name="'admin'"
            :parent="option.parent">

            <component :is="option.icon" />
            <template #text>
              {{ option.name }}
            </template>
          </IconRoute>

        </div>

        <footer class="absolute bottom-10 w-full">
          <FooterPanel 
            name-route="EditProfile"
          />
        </footer>
      </div>

      <main class="w-full overflow-auto mt-0 ml-72">

        <!--Sección de notificaciones-->
        <div class="fixed top-0 left-72 right-0 z-10" ref="ellipsis">
          <div class="bg-white p-3 w-full border-b-2 border-gray-400/60">
            <div class="flex justify-between items-center">
              
              <p class="text-gray-900 font-bold text-xl ml-5">Administración</p>

              <div class="relative">
                <div class="relative inline-block mr-5 cursor-pointer">
                  <BellAlertIcon class="w-7 text-blue-500 hover:text-blue-300" 
                    @click="selectNotify"
                  />
                  <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500">
                    {{ notification.countNotify }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!--NOTIFICACIONES-->
        <div  v-if="isSelectNotify">
          <div class="absolute top-16 right-3 z-10">
            <div class="bg-gray-50 shadow-2xl rounded-lg max-h-96 w-96 p-5 overflow-y-auto">
              <div class="flex justify-between">
                <h3 class="text-gray-700 font-semibold text-lg">Notificaciones</h3>
                  <XMarkIcon 
                    class="w-5 cursor-pointer"
                    @click="selectNotify"  
                  />
              </div>

              <div class="flex gap-3 text-blue-500 cursor-pointer mt-2 text-sm ">
                <p :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 1 }"
                  @click="select = 1"
                >No Leidas</p>
                <p :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 2 }"
                  @click="select = 2"
                >Leidas</p>
              </div>
              
              <!--NOTIFICACIONES NO LEIDAS-->
              <div v-if="select == 1">
                <div v-if="notify.length > 0">
                    <CardNotification 
                      v-for="noty in notify"
                      :key="noty.id" 
                      :notify="noty" 
                      :is-delete="false"
                    />
                </div>

                <div v-else>
                  <p class="text-center mt-5 text-sm text-red-500">No hay notificaciones recientes</p>
                </div>
              </div>

              <!--NOTIFICACIONES LEIDAS-->
              <div v-if="select == 2">  
                <div v-if="notifyRead.length > 0">
                    <CardNotification 
                      v-for="noty in notifyRead"
                      :key="noty.id" 
                      :notify="noty" 
                      :is-delete="true"
                    />
                </div>
                <div v-else>
                  <p class="text-center mt-5 text-sm text-red-500">No hay notificaciones</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        
        <!--Contenido Principal-->
        <div class="mt-16">
        </div>
        <RouterView>
        </RouterView>
      </main>
    </div>

  </div>
</template>

<script setup>

import { ref, onMounted, watch } from "vue";
import { storeToRefs } from 'pinia'
import { RouterView, useRoute } from "vue-router";
import { useWebSocketStore } from "../../stores/webSocket";

import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  WrenchIcon,
  WrenchScrewdriverIcon,
  Cog8ToothIcon,
  Bars4Icon,
  XMarkIcon,
  BellAlertIcon,
BuildingStorefrontIcon

} from "@heroicons/vue/24/solid";
import IconRoute from "../../components/IconRoute.vue";
import FooterPanel from "../../components/FooterPanel.vue";
import DropDownButton from "../../components/DropDownButton.vue";
import { useNotificationStore } from "../../stores/notification";
import CardNotification from "../../components/CardNotification.vue";

const webSocket = useWebSocketStore()
const visible = ref(false); //Estado del menu desplegable
const mobile = ref(window.innerWidth <= 768);

const route = useRoute();
const routeName = ref(route.name);
const dropDown2 = ref(false);
const ellipsis = ref(null);
const notification = useNotificationStore()
const isSelectNotify = ref(false)
const select = ref(1)

const { notify, notifyRead } = storeToRefs(notification)

//Funcion para mostrar el menu desplegable
const isVisible = () => {
  visible.value = !visible.value;
};

//Funcion para saber el ancho de la pantalla actual
const handleResize = () => {
  mobile.value = window.innerWidth <= 768;
};


onMounted(() => {
  window.addEventListener("resize", handleResize); //maneja la responsividad
  webSocket.startListenReportMaterial() //Escucha por el evento reporte de material
  webSocket.startListenReportEquipment() //Escucha por el evento de reporte de equipo
  webSocket.startlisteningMaterialUnavailable() //Escucha por el evento para pedir material (que no esta disponible o no existe)
  webSocket.startListeningEquipmentUnavailable() //Escucha por el evento para pedir equipo (que no esta disponible o no existe)
  notification.getRead() //Mensajes leidos
  notification.getUnRead() //Mensajes no leídos
});

//Notificacion
const selectNotify = () => {
  isSelectNotify.value = !isSelectNotify.value
}


//Lista de opciones del panel, contiene sus nombresm iconos y rutas

const optionsFirst = [
  { name: "Inicio", icon: HomeIcon, nameRoute: "HomePageAdmin" },
  { name: "Administrar Trabajos", icon: BriefcaseIcon, nameRoute: 'JobHome', parent: 'JobLayout' }
]


const optionStock = [
  { name: "Materiales", icon: WrenchIcon, nameRoute: "MaterialHome", parent: 'MaterialManageAdmin' },
  { name: "Equipos", icon: WrenchScrewdriverIcon, nameRoute: "EquipmentHome", parent: 'EquipmentManageAdmin' },
  { name: "Pedidos y desalojos", icon: ShoppingBagIcon, nameRoute: "ordersAdmin", parent: 'ordersLayout' }
]


const optionsPanel = [

  { name: 'Configuraciones de gestión', icon: Cog8ToothIcon, nameRoute: "Clients", parent: "ConfigAdmin" },
  //{ name: "Seguimiento de trabajos", icon: CheckCircleIcon, nameRoute: "JobsTrackingAdmin"},
  { name: "Administrar locales", icon: BuildingStorefrontIcon, nameRoute: "shopManage" },
  { name: "Asignación de roles", icon: UserGroupIcon, nameRoute: "RoleAssignAdmin" },
  { name: "Informes", icon: ClipboardDocumentCheckIcon, nameRoute: "reportAdmin" }
]

const getParentRouteName = () => {
  // Encuentra el segundo último elemento coincidente que debería ser la ruta padre
  const parentRoute = route.matched[route.matched.length - 2];
  return parentRoute ? parentRoute.name : null;
};

//Watch para ver los cambios en las rutas
watch(
  () => route.name,
  (newRouteName) => {
    routeName.value = newRouteName;

    getParentRouteName();
    //Busca para el segundo dropDownButton
    const foundOption2 = optionStock.find(option => option.nameRoute === routeName.value);
    dropDown2.value = foundOption2 !== undefined;
  }
);

</script>


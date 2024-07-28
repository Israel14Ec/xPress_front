<template>
    <!--VISTA PARA MOVILES-->
  <div v-if="mobile">
      <header class="mb-20">
      <div class="bg-gray-700 py-3 fixed top-0 left-0 right-0 shadow-md">
        
        <!--Sección de notificaciones-->
        <div class="relative">         
            <div class="flex justify-between items-start">
              <Bars4Icon
                @click="isVisible"
                class="ml-4 w-5 text-white cursor-pointer" 
              />

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

        <div v-if="isSelectNotify">
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
                <button :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 2 }"
                  @click="getNotifyRead()"
                >Leidas</button>
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
                <div v-if="notification.loadRead">
                  <p class=" mt-5 text-gray-700 text-sm font-semibold text-center">Cargando ...</p>
                </div>
                <div v-else>
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
        </div>
    
        <!--Sección de menu desplegable-->
        <div v-if="visible"
          class="bg-gray-100/80 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm z-0"
          @click="isVisible"
        ></div>
        <div v-if="visible"
          class="bg-gray-800 min-h-screen w-80 fixed top-0 left-0"
        >
          <div class="pt-3">
            <button class="ml-4 mt-4 text-gray-800" @click="isVisible">
              <XMarkIcon class="w-5 text-white"/>
            </button>
            <div>
              <img
                src="../../assets/img/LogoWhite.png"
                class="h-16 mx-auto"
                alt="Logo white"
              />
              <h2 class="text-center text-yellow-400 text-4xl font-bold">
                xPress
              </h2>
            </div>
            <div class="text-center">

            </div>
            <footer class="absolute bottom-5">
              <FooterPanel 
                name-route="EditProfileEmployee"
              />
            </footer>
          </div>
        </div>
      </div>
    </header>
    <main class="mt-10"
      :class="{ 'relative -z-10': visible }"
    >
      <RouterView>
      </RouterView>
    </main>
  </div>


    <!--VISTA PARA PANTALLAS GRANDES-->
    <div v-else>
        <div class="flex flex-row">
            <div class="bg-gray-800 w-72 h-screen fixed">
                <div class="relative mt-4">
                    <img src="../../assets/img/LogoWhite.png" class="mx-auto h-20" alt="Logo white"/>
                    <h2 class="text-center text-yellow-400 text-2xl font-bold mb-4">
                        xPress
                    </h2>
                </div>

                <IconRoute
                  v-for="option in option"
                    :key="option.name"
                    :to="option.nameRoute"
                    :parent-route-name="'EmployeeLayout'"
                    :parent="option.parent"
                >
                    <component :is="option.icon" />
                    <template #text>{{ option.name }}</template>
                </IconRoute>

                <footer class="absolute bottom-10 w-full">
                    <FooterPanel 
                      name-route="EditProfileEmployee"
                    />
                </footer>
            </div>

            <main class="w-full overflow-auto mt-0 ml-72">

                <!--Sección de notificaciones-->
                <div class="fixed top-0 left-72 right-0 z-10">
                  <div class="bg-white p-3 w-full border-b-2 border-gray-400/60 ">
                    <div class="flex justify-between items-start">
                      <h2 class="text-gray-600 font-semibold text-xl"> Departamento: <span class="font-normal">
                        {{ department}}
                      </span> </h2>

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

                <div v-if="isSelectNotify">
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
                        <button :class="{ 'bg-blue-100 rounded-xl px-3 py-1': select === 2 }"
                          @click="getNotifyRead()"
                        >Leidas</button>
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
                        <div v-if="notification.loadRead">
                          <p class=" mt-5 text-gray-700 text-sm font-semibold text-center">Cargando ...</p>
                        </div>
                        <div v-else>
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
                </div>
                
                <div class="mb-16 p-1">
                  <!--Contenido Principal-->    
                  <RouterView>
                  </RouterView>
                </div>

            </main>
        </div>
    </div>

</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import FooterPanel from '../../components/FooterPanel.vue'
import { useWebSocketStore } from '../../stores/webSocket'
import { BellAlertIcon, XMarkIcon, Bars4Icon, HomeIcon, BriefcaseIcon } from '@heroicons/vue/24/solid'
import { useNotificationStore } from '../../stores/notification'
import { useUtilsStore } from '../../stores/utils'
import IconRoute from '../../components/IconRoute.vue'
import CardNotification from '../../components/CardNotification.vue'

const webSocket = useWebSocketStore()
const visible = ref(false); 
const mobile = ref(window.innerWidth <= 768);
const isSelectNotify = ref(false)
const notification = useNotificationStore()
const util = useUtilsStore()
const select = ref(1)

const { department } = storeToRefs(util)
const { notify, notifyRead } = storeToRefs(notification)

//Funcion para mostrar el menu desplegable
const isVisible = () => {
    visible.value = !visible.value;
};

//Funcion para saber el ancho de la pantalla actual
const handleResize = () => {
    mobile.value = window.innerWidth <= 768;
};

//Notificacion
const selectNotify = () => {
  isSelectNotify.value = !isSelectNotify.value
}

onMounted(() => {
    webSocket.startEmployeeListening()
    window.addEventListener("resize", handleResize) //Manejador de eventos 
    util.getDepartmentById()
    notification.getUnRead() //Trae las notificaciones no leiadas
})

//Traer notificaciones leidas
const getNotifyRead = () => {
  notification.getRead()
  select.value = 2
  
}

const option = [
  {name: 'Inicio', icon: HomeIcon, nameRoute: 'HomeEmployee'},
  {name: 'Trabajos', icon: BriefcaseIcon, nameRoute: 'WorkProgressEmployee', parent: 'WorkLayoutEmployee'}
]


</script>


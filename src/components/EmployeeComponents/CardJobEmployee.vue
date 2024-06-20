<template>
    <div class="bg-gray-50 shadow-xl rounded-lg md:px-40 overflow-y-auto px-5 py-5 mb-10">
        <div class="flex flex-row justify-between items-start">
            <div class="md:flex gap-3">
                <h4 class="text-yellow-500 text-lg font-semibold">Trabajo: </h4>
                <p class="text-gray-700 text-lg">{{ workOrders.job.name_job }}</p>
            </div>

            <ButtonBlack class="bg-gray-900 hover:bg-gray-700 text-white"  
                @click="acceptHandler(workOrders)"
                >
                <CheckCircleIcon />
                <template #text>Comenzar </template>
            </ButtonBlack>
        </div>


        <div class="flex flex-col gap-6 md:flex-row mb-3">
            <div class="w-full md:w-2/3">
                <div class="h-48">
                    <img :src="workOrders.job.before_picture ?
                        workOrders.job.before_picture : '/trabajo.png'" class="h-full w-full object-cover rounded-md"
                        alt="Imagen de trabajo"
                    >
                </div>
          
    
                <div class="flex flex-col gap-1 mt-4">
                    <p class="text-red-500 text-sm">Fecha de Inicio:
                        <span class="text-gray-700">{{ workOrders.assigned_date }}</span>
                    </p>
                    <p class="text-red-500 text-sm">Fecha de Fin:
                        <span class="text-gray-700">{{ workOrders.end_date }}</span>
                    </p>
                </div>

            </div>
            <div class="w-full space-y-1">

                <div>
                    <h4 class="title">Descripción: </h4>
                    <p class="text">{{ workOrders.job.description }} </p>
                </div>

                <div>
                    <h4 class="title">Instrucciones: </h4>
                    <p class="text"> {{ workOrders.instructions }}</p>
                </div>

            </div>
        </div>
        <!--SELECT PARA AGREGAR O OCULTAR INFORMACIÓN-->
        <div class="flex justify-center" @click="selectChange()">
            <div class="cursor-pointer">
                <div v-if="select === false">
                    <div class="flex flex-row gap-2 text-yellow-600 font-semibold">
                        <ChevronDownIcon  class="w-5"/>
                        <p class="text-sm font-semibold">Ver mas detalles</p>
                    </div>
                </div>
                <div v-else>
                    <div class="flex flex-row gap-2 text-yellow-600 mt-5">
                        <ChevronUpIcon  class="w-5"/>
                        <p class="text-sm font-semibold">Ocultar</p>
                    </div>
                </div>
            </div>
        </div>

        <div  v-if="select === true" class="border-t-2 border-gray-400">
            <div class="flex flex-row gap-5 mt-4">
                <div class="w-full md:w-1/2">
                    <p class="text-yellow-500">Ubicación</p>
                    <p class="title">Local: <span class="text">{{  workOrders.job.establishment.name_establishment }}</span></p>
                    <div class="h-48">
                        <LMap 
                            v-model:zoom="zoom" 
                            :center="workOrders.job.establishment.location" 
                            :use-global-leaflet="false"
                            >
        
                            <LMarker
                                :lat-lng="workOrders.job.establishment.location"
                            >
                                <LPopup>{{ workOrders.job.establishment.name_establishment }}</LPopup>
                            </LMarker>
                        
                            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                        </LMap>
                    </div>
                </div>
                <div class="border-l-2 border-gray-400 w-full md:w-1/2">
                    <div class="ml-5">
                        <div>
                            <h3 class="text-yellow-500 font-semibold mb-5">Trabajadores asignados</h3>
                            <div class="flex flex-wrap -mx-2">
                                <div class="px-2">
                                    <CardAssignedWorker 
                                        v-for="user in workOrders.workers" 
                                        :key="user.id_user"
                                        :user="user" 
                                    />
                                </div>
                            </div>
                        </div>


                        <div>
                            <h3 class="text-yellow-500 font-bold">Materiales asignados</h3>
                            <div v-if="workOrders.material_assigned.length > 0">
                                <div class="flex flex-wrap -mx-2">
                                    <div class="px-2">
                                        <CardAssignedMaterial 
                                            v-for="material in workOrders.material_assigned" 
                                            :key="material.id_material"
                                            :material="material"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p class="text-red-500 text-sm text-center">No se asigno materiales</p>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-yellow-500 font-bold mb-5">Equipos asignados</h3>
                            <div v-if="workOrders.equipment_assigned.length > 0">
                                <CardAssignedEquipment 
                                    v-for="equipment in workOrders.equipment_assigned"
                                    :key="equipment.id_construction_equipment"
                                    :equipment="equipment"
                                />
                            </div>
                            <div v-else>
                                <p class="text-red-500 text-sm text-center">No se asigno equipos</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '../../stores/job'
import { useAssignedWorkerStore } from '../../stores/assignedWorker'
import { useWorkOrderStore } from '../../stores/workOrders'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import useLocationMap from "../../composables/useLocationMap";
import CardAssignedWorker from "../Utils/CardAssignedWorker.vue";
import CardAssignedMaterial from "../Utils/CardAssignedMaterial.vue";
import CardAssignedEquipment from "../Utils/CardAssignedEquipment.vue";
import ButtonBlack from "../ButtonBlack.vue";
import Swal from 'sweetalert2'

const jobStore = useJobStore()
const router = useRouter()

const assignStore = useAssignedWorkerStore()
const orderStore = useWorkOrderStore()

const { zoom } = useLocationMap()

const select = ref(false)

const stateWorkOrder = 2

const props = defineProps({
    workOrders: Object
})

const selectChange = () => {
    select.value = !select.value
}


const acceptHandler = (item) => {

    Swal.fire({
        title: 'Inicio del trabajo asignado ',
        html: `
            <p>Estás a punto de comenzar el trabajo  <strong>${item.job.name_job}</strong>.</p>
            <p>Preciona en aceptar para iniciar.</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if(result.isConfirmed) {

            //jobStore.updateStatusjob(item.id_job) //Actualizar el estado del trabajo
            orderStore.updateStatusWorkOrder(item.id_work_order, stateWorkOrder) //Actualiza el estado de la orden de trabajo
            assignStore.deleteWorkUser(item.id_work_order) //Saca del vector ref
            router.push({'name': 'WorkProgressEmployee'}) //Redirige a la pagina de trabajos
        }
    })
}
</script>

<style scoped>
.title {
    @apply text-gray-700 font-semibold inline-block mr-2
}

.text {
    @apply text-sm inline-block font-normal text-gray-500
}
</style>
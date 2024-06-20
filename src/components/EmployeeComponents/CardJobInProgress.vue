<template>
    <div class="bg-gray-50 shadow-xl rounded-lg overflow-y-auto md:px-28 py-5 mb-10">
        <div class="flex flex-row justify-between items-start">
            <div class="md:flex gap-3">
                <h4 class="text-yellow-500 text-lg font-semibold">Trabajo: </h4>
                <p class="text-gray-700 text-lg">{{ WorkInProgress.job.name_job }}</p>
            </div>

            <RouterLink :to="{ name: 'CompleteJobEmployee', params: { id: WorkInProgress.id_work_order } }">
                <ButtonBlack class="bg-gray-900 hover:bg-gray-700 text-white">
                    <CheckCircleIcon />
                    <template #text>Finalizar</template>
                </ButtonBlack>
            </RouterLink>
        

        </div>

        <div class="flex flex-col gap-6 md:flex-row mb-3">
            <div class="w-full md:w-2/3">
                <div class="h-48">
                    <img :src="WorkInProgress.job.before_picture ?
                        WorkInProgress.job.before_picture : '/trabajo.png'"
                        class="h-full w-full object-cover rounded-md" alt="Imagen de trabajo">
                </div>
                <div class="flex flex-col gap-1 mt-4">
                    <p class="text-red-500 text-sm">Fecha de Inicio:
                        <span class="text-gray-700">{{ WorkInProgress.assigned_date }}</span>
                    </p>
                    <p class="text-red-500 text-sm">Fecha de Fin:
                        <span class="text-gray-700">{{ WorkInProgress.end_date }}</span>
                    </p>
                </div>

            </div>

            <div class="w-full space-y-1">

                <div>
                    <h4 class="title">Descripción: </h4>
                    <p class="text">{{ WorkInProgress.job.description }} </p>
                </div>

                <div>
                    <h4 class="title">Instrucciones: </h4>
                    <p class="text"> {{ WorkInProgress.instructions }}</p>
                </div>
            </div>
        </div>
    
        <div class="flex justify-center mb-5" @click="selectChange()">
            <div class="cursor-pointer">
                <div v-if="select === false">
                    <div class="flex flex-row gap-2 text-yellow-500">
                        <ChevronDownIcon class="w-5" />
                        <p class="text-sm font-semibold">Ver mas detalles</p>
                    </div>
                </div>
                <div v-else>
                    <div class="flex flex-row gap-2 text-yellow-500">
                        <ChevronUpIcon class="w-5" />
                        <p class="text-sm font-semibold">Ocultar</p>
                    </div>
                </div>
            </div>
        </div>

        <div @click="resetJob(WorkInProgress)">
            <p class="text-gray-500 hover:text-gray-300  text-sm cursor-pointer text-center font-bold mb-5 tracking-wide"> 
                Regresa el trabajo a su estado anterior
            </p>
        </div>
   
        <div v-if="select" class="border-t-2 border-gray-400">
            <div class="flex flex-row gap-5 mt-4">
                <div class="w-full md:w-1/2">
                    <p class="text-yellow-500">Ubicación</p>
                    <p class="title">Local: <span class="text"> 
                            {{ WorkInProgress.job.establishment.name_establishment }}
                        </span>
                    </p>
                    <div class="h-48">
                        <LMap v-model:zoom="zoom" :center="WorkInProgress.job.establishment.location"
                            :use-global-leaflet="false">

                            <LMarker :lat-lng="WorkInProgress.job.establishment.location">
                                <LPopup>{{ WorkInProgress.job.establishment.name_establishment }}</LPopup>
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
                                    <CardAssignedWorker v-for="user in WorkInProgress.workers" :key="user.id_user"
                                        :user="user" />
                                </div>
                            </div>
                        </div>


                        <div>
                            <h3 class="text-yellow-500 font-bold">Materiales asignados</h3>
                            <div v-if="WorkInProgress.material_assigned.length > 0">
                                <div class="flex flex-wrap -mx-2">
                                    <div class="px-2">
                                        <CardAssignedMaterial v-for="material in WorkInProgress.material_assigned"
                                            :key="material.id_material" :material="material" />
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p class="text-red-500 text-sm text-center">No se asigno materiales</p>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-yellow-500 font-bold mb-5">Equipos asignados</h3>
                            <div v-if="WorkInProgress.equipment_assigned.length > 0">
                                <CardAssignedEquipment v-for="equipment in WorkInProgress.equipment_assigned"
                                    :key="equipment.id_construction_equipment" :equipment="equipment" />
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
import { useRouter, RouterLink } from 'vue-router'
import { useWorkOrderStore } from '../../stores/workOrders'
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import ButtonBlack from '../ButtonBlack.vue';
import useLocationMap from '../../composables/useLocationMap';
import CardAssignedWorker from "../Utils/CardAssignedWorker.vue";
import CardAssignedMaterial from "../Utils/CardAssignedMaterial.vue";
import CardAssignedEquipment from "../Utils/CardAssignedEquipment.vue";
import Swal from 'sweetalert2'

const orderStore = useWorkOrderStore()
const select = ref(false)
const { zoom } = useLocationMap()
const router = useRouter()
const statusAssignResource = 1 //Estado anterior

defineProps({
    WorkInProgress: Object
})

const selectChange = () => {
    select.value = !select.value
}

const resetJob = (item) => {
    Swal.fire({
        title: 'Revertir Estado del Trabajo',
        html: `
            <p>Estás a punto de regresar el trabajo <strong>${item.job.name_job}</strong> al estado 'Asignado'.</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Rechazar',
    }).then((result) => {
        if(result.isConfirmed) {
            orderStore.updateStatusWorkOrder(item.id_work_order, statusAssignResource)//Revetir el estado de la orden de trabajo
            router.push({'name': 'HomeEmployee'}) //Redirige a la pagina de trabajos
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
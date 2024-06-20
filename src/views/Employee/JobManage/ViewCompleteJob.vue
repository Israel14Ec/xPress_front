<template>
    <div class="max-w-[95%] mt-5 mx-auto">
        <div class="flex flex-row text-xl gap-5 text-black">
            <RouterLink :to="{ name: 'WorkHistoryEmployee' }">
                <ChevronLeftIcon class="w-5" />
            </RouterLink>

            <p class="font-semibold text-yellow-500">Trabajo: <span class="font-normal ml-3 text-gray-700">
                    {{ nameJob }} </span> </p>
        </div>
        <div v-if="load">
            <Spinner />
        </div>
        <div v-else>
            <div class="">
                <div class="bg-gray-50 shadow-xl rounded-lg overflow-y-auto md:px-20 py-10 mb-10">
                    <p class="font-semibold text-yellow-500 mb-5">{{ nameJob }} </p>

                    <div class="flex flex-col gap-6 md:flex-row mb-3">
                        <div class="w-full md:w-1/3">
                            <div class="h-60">
                                <img :src="workOrder.job.before_picture ?
                                    workOrder.job.before_picture : '/trabajo.png'" class="h-full w-full object-cover rounded-md"
                                    alt="Imagen de trabajo"
                                >
                            </div>
                        </div>
                        <div class="w-full space-y-1">
                            <div>
                                <h4 class="title">Descripción: </h4>
                                <p class="text">{{ workOrder.job.description }} </p>
                            </div>
                        </div>
                    </div>

                    <div class="border-t-2 border-gray-400">
                        <p class="text-sm mt-5 font-semibold text-yellow-500 mb-5">Orden de trabajo</p>
                        <div class="flex flex-col md:flex-row gap-5">
                            <div class="w-full md:w-1/2">
                                <h4 class="title">Instrucciones: </h4>
                                <p class="text"> {{ workOrder.instructions }}</p>
                            </div>
                            <div class="w-full md:w-1/2">
                                <div class="flex flex-col gap-1 mt-4 text-sm">
                                    <p class="text-red-500">Fecha de Inicio:
                                        <span class="text-gray-700">{{ workOrder.assigned_date }}</span>
                                    </p>
                                    <p class="text-red-500">Fecha de Fin:
                                        <span class="text-gray-700">{{ workOrder.end_date }}</span>
                                    </p>
                                    <p class="text-red-500">Tiempo trabajado:
                                        <span class="text-gray-700">{{ workOrder.hour_job }} horas</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <p class="mt-4 text-gray-500 font-semibold text-sm">Imágenes del trabajo completado</p>
                        <div class="flex flex-wrap">
                            <div v-for="(imageUrl, index) in workOrder.after_picture" :key="index" class="m-2 bg-gray-50 shadow rounded-lg p-1">
                                <img :src="imageUrl" alt="Imagen" class="w-40 h-40 object-contain">
                            </div>
                        </div>
                    </div>

                    <div class="border-t-2 border-gray-400">
                        <p class="text-sm mt-5 font-semibold text-yellow-500">Detalles de la orden de trabajo</p>
                        <div class="flex flex-row gap-5 mt-4">
                            <div class="w-full md:w-1/2">
                                <p class="text-yellow-500">Ubicación</p>
                                <p class="title mb-2">Local: 
                                    <span class="text">{{  workOrder.job.establishment.name_establishment }}</span>
                                </p>

                                <div class="h-48">
                                    <LMap v-model:zoom="zoom" :center="workOrder.job.establishment.location"
                                        :use-global-leaflet="false">

                                        <LMarker :lat-lng="workOrder.job.establishment.location">
                                            <LPopup>{{ workOrder.job.establishment.name_establishment }}</LPopup>
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
                                                <CardAssignedWorker v-for="user in workOrder.workers" :key="user.id_user"
                                                    :user="user" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 class="text-yellow-500 font-bold">Materiales asignados</h3>
                                        <div v-if="workOrder.material_assigned.length > 0">
                                            <div class="flex flex-wrap -mx-2">
                                                <div class="px-2">
                                                    <CardAssignedMaterial v-for="material in workOrder.material_assigned"
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
                                        <div v-if="workOrder.equipment_assigned.length > 0">
                                            <CardAssignedEquipment v-for="equipment in workOrder.equipment_assigned"
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
            </div>
        </div>

    </div>
</template>

<script setup>

import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs} from 'pinia'
import { useWorkOrderStore } from '../../../stores/workOrders'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import useLocationMap from '../../../composables/useLocationMap'
import Spinner from '../../../components/Spinner.vue';
import CardAssignedWorker from '../../../components/Utils/CardAssignedWorker.vue'
import CardAssignedMaterial from '../../../components/Utils/CardAssignedMaterial.vue'
import CardAssignedEquipment from '../../../components/Utils/CardAssignedEquipment.vue'


const route = useRoute()
const workOrderStore = useWorkOrderStore()
const { zoom } = useLocationMap()
const { load, workOrder, nameJob } = storeToRefs(workOrderStore)


onMounted(async ()=> {
    await workOrderStore.getWorkOrderCompleteByID(route.params.id)
})


</script>

<style scoped>
.title {
    @apply text-gray-700 font-semibold inline-block mr-2
}

.text {
    @apply text-sm inline-block font-normal text-gray-500
}


</style>
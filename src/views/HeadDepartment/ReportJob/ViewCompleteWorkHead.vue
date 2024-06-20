<template>
    <div class="max-w-[95%] mt-5 mx-auto">
        <div class="flex flex-row text-xl gap-5 text-black items-center">
            <RouterLink :to="{ name: 'ReportJob'}">
                <ChevronLeftIcon class="w-5" />
            </RouterLink>

            <p class="font-semibold text-yellow-500">Trabajo: <span class=" ml-2 text-gray-700">
                    {{ nameJobHead }} </span> </p>
        </div>

        <div v-if="loadWorkComplete">
            <Spinner />
        </div>

        <div v-else-if="!loadWorkComplete && workOrderIdHead"> 
            <div class="relative mt-10">
                <button 
                    @click="exportPdf" 
                    class="bg-gray-500 hover:bg-gray-700 text-sm text-white font-bold py-2 px-3 rounded flex gap-2 absolute -top-5"
                    >
                    <ArrowDownTrayIcon class="w-5"/>
                    Exportar a PDF
                    
                </button>

                <div id="content-to-print" >
                    <div class="bg-gray-50 shadow-xl rounded-lg overflow-y-auto md:px-20 py-10">
                        <p class="font-semibold text-yellow-500 mb-5 text-lg">{{ nameJobHead }} </p>

                        <div class="flex flex-col gap-6 md:flex-row mb-3">
                            <div class="w-full md:w-1/3 shadow-sm">
                                <img :src="workOrderIdHead?.job?.before_picture || '/trabajo.png'"
                                class=" h-64 w-full object-contain rounded-md"
                                alt="Imagen de trabajo">
                            </div>

                            <div class="w-full md:w-2/3 space-y-1">
                                <div>
                                    <h4 class="title">Descripción: </h4>
                                    <p class="text">{{ workOrderIdHead.job.description }} </p>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                        
                        <div class="border-t-2 border-gray-400">
                            <p class="text-sm mb-4 font-semibold text-yellow-500">Orden de trabajo</p>
                            <div class="flex flex-col md:flex-row gap-5">
                                <div class="w-full md:w-1/2">
                                    <h4 class="title">Instrucciones: </h4>
                                    <p class="text"> {{ workOrderIdHead.instructions }}</p>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="flex flex-col gap-1">
                                        <p class="title">Fecha de Inicio:
                                            <span class="text">{{ workOrderIdHead.assigned_date }}</span>
                                        </p>
                                        <p class="title">Fecha de Fin:
                                            <span class="text">{{ workOrderIdHead.end_date }}</span>
                                        </p>
                                        <p class="title ">Tiempo trabajado:
                                            <span class="text">{{ workOrderIdHead.hour_job }} horas</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p class="mt-4 text-gray-500 font-semibold text-sm">Imágenes del trabajo completado</p>
                            <div class="flex flex-wrap">
                                <div v-for="(imageUrl, index) in workOrderIdHead.after_picture" :key="index" class="m-2 bg-gray-50 shadow rounded-lg p-1">
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
                                        <span class="text">{{  workOrderIdHead.job.establishment.name_establishment }}</span>
                                    </p>

                                    <div class="h-48">
                                        <LMap v-model:zoom="zoom" :center="workOrderIdHead.job.establishment.location"
                                            :use-global-leaflet="false" :options="{dragging: false}">

                                            <LMarker :lat-lng="workOrderIdHead.job.establishment.location">
                                                <LPopup>{{ workOrderIdHead.job.establishment.name_establishment }}</LPopup>
                                            </LMarker>

                                            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                                        </LMap>
                                    </div>
                                </div>

                                <div class="border-l-2 border-gray-400 w-full md:w-1/2">
                                    <div class="ml-5">

                                        <div>
                                            <h3 class="text-yellow-500 font-semibold mb-3">Trabajadores asignados</h3>
                                            <div class="">
                                                <div class="px-2 flex flex-wrap gap-5">
                                                    <CardAssignedWorker v-for="user in workOrderIdHead.workers" :key="user.id_user"
                                                        :user="user" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 class="text-yellow-500 font-bold mb-3">Materiales asignados</h3>
                                            <div v-if="workOrderIdHead.material_assigned.length > 0">
                                                <div>
                                                    <div class="px-2">
                                                        <CardAssignedMaterial v-for="material in workOrderIdHead.material_assigned"
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
                                            <div v-if="workOrderIdHead.equipment_assigned.length > 0">
                                                <CardAssignedEquipment v-for="equipment in workOrderIdHead.equipment_assigned"
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
    </div> 

</template>

<script setup>

import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkOrderStore  } from '../../../stores/workOrders'
import { ChevronLeftIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import useLocationMap from '../../../composables/useLocationMap'
import Spinner from '../../../components/Spinner.vue';
import CardAssignedEquipment from '../../../components/Utils/CardAssignedEquipment.vue'
import CardAssignedMaterial from '../../../components/Utils/CardAssignedMaterial.vue'
import CardAssignedWorker from '../../../components/Utils/CardAssignedWorker.vue'
import html2pdf from 'html2pdf.js'

const route = useRoute()
const orderStore = useWorkOrderStore()

const { zoom } = useLocationMap()
const { workOrderIdHead, nameJobHead, loadWorkComplete } = storeToRefs(orderStore)

//Exporta a pdf
const exportPdf = () => {
    const element = document.getElementById('content-to-print');
    html2pdf().from(element).set({
        margin: [10, 10, 10, 10], // top, left, bottom, right in mm
        filename: `Trabajo ${nameJobHead.value}`,
        html2canvas: {
            useCORS: true,
        },
        jsPDF: {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        }
    }).save();
}


onMounted(() => {
    orderStore.getWorkCompleteByIdHead(route.params.id)
})
</script>

<style scoped>

.title {
    @apply text-gray-900 font-semibold;
}

.text {
    @apply text-gray-700 font-normal;
}
</style>

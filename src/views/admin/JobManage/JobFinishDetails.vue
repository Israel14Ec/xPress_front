<template>
    <div>
        <div class="flex flex-row text-xl gap-5 text-black items-center">
            <RouterLink :to="{name: 'AllJobAdmin'}">
                <ChevronLeftIcon class="w-5" />
            </RouterLink>
            <p class="font-semibold text-yellow-500">Trabajo: 
                <span class=" ml-2 text-gray-700">{{ jobComplete.name_job }} </span> 
            </p>
        </div>
        <div v-if="loadCompleteJob">
            <Spinner/>
        </div>
        <div v-else class="md:px-10 mx-auto">
            <div class=" relative mt-10">
                <ButtonBlack class="bg-gray-500 hover:bg-gray-700 text-white" @click="exportPdf">
                    <ArrowDownTrayIcon/>
                    <template #text>Exportar a PDF</template>
                </ButtonBlack>

                <div id="content-to-pdf">
                    <div class="bg-gray-50 shadow-xl rounded-lg overflow-y-auto px-5 py-5">
                        <p class="font-semibold text-lg text-yellow-500 mb-5">{{ jobComplete.name_job }} </p>
                        <div class="flex flex-col gap-6 md:flex-row mb-3">
                            <div class="w-full md:w-1/3">
                                <img :src="jobComplete.before_picture"
                                    class=" h-64 w-full object-contain rounded-md"
                                    :alt="jobComplete.name_job"
                                />
                            </div>
                            <div class="w-full md:w-2/3">
                                <div>
                                    <h4 class="title">Descripción: </h4>
                                    <p class="text">{{ jobComplete.description }} </p>
                                </div>

                                <div class=" mt-5 grid grid-cols-2 gap-3">
                                    <div>
                                        <h4 class="title">Número de CAF: </h4>
                                        <p class="text">{{ jobComplete.num_caf }} </p>
                                    </div>
                                    <div>
                                        <h4 class="title">Cliente: </h4>
                                        <p class="text">{{ jobComplete.name_client }} </p>
                                    </div>
                                    <div>
                                        <h4 class="title">Priodidad: </h4>
                                        <p class="text">{{ jobComplete.name_priority }} </p>
                                    </div>
                                    <div>
                                        <h4 class="title">Tipo de mantenimiento: </h4>
                                        <p class="text">{{ jobComplete.name_maintenance }} </p>
                                    </div>
                                    <div>
                                        <h4 class="title">Tipo de mantenimiento: </h4>
                                        <p class="text">{{ jobComplete.name_maintenance }} </p>
                                    </div>
                                    <div>
                                        <h4 class="title">Medio de comunicación: </h4>
                                        <p class="text">{{ jobComplete.name_communication }} </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--MAPA DEL LOCAL-->
                        <div class=" border-t-2 p-4" v-if="parsedLocation">
                            <p class="text-yellow-500 font-semibold mb-3">Local</p>
                            <div class=" flex gap-5">
                                <div class="w-1/2">
                                    <p class="title">Local: 
                                        <span class="text font-normal">{{  jobComplete.name_establishment }}</span>
                                    </p>
                                    <p class="title">Ubicación: 
                                        <span class="text font-normal">{{  jobComplete.description_establishment }}</span>
                                    </p>
                                </div>  
                    
                                <div class="h-48 w-1/2">
                                    
                                    <LMap v-model:zoom="zoom" :center="parsedLocation" :use-global-leaflet="false"
                                        :options="{dragging: false}"
                                        >
                                        <LMarker :lat-lng="parsedLocation">
                                            <LPopup>{{ jobComplete.name_establishment }}</LPopup>
                                        </LMarker>
                                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                                    </LMap>
                                </div>
                            </div>
                            
                        </div>
                        <!--DATOS DE LA ORDEN DE TRABAJO-->
                        <div class="border-t-2 border-gray-400">
                            <!--COMPONENTE-->
                            <div v-if="jobComplete.work_orders">
                                <CardWorkOrder
                                    v-for="workOrder in jobComplete.work_orders"
                                    :key="workOrder.id_work_order"
                                    :work-order="workOrder"
                                />    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkOrderStore } from '../../../stores/workOrders'
import { ChevronLeftIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import "leaflet/dist/leaflet.css"
import useLocationMap from '../../../composables/useLocationMap'
import Spinner from '../../../components/Spinner.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'
import CardWorkOrder from '../../../components/AdminComponents/CardWorkOrder.vue'
import html2pdf from 'html2pdf.js'

const route = useRoute()
const workOrderStore = useWorkOrderStore()

const { loadCompleteJob, jobComplete } = storeToRefs(workOrderStore)
const { zoom } = useLocationMap()

const parsedLocation = ref(null)

onMounted(async () => {
    await workOrderStore.getCompleteWorkByIDJob(route.params.id)
    if (typeof jobComplete.value.location === 'string') {
        parsedLocation.value = JSON.parse(jobComplete.value.location)
    } else {
        parsedLocation.value = jobComplete.value.location
    }
})

// Observa los cambios en jobComplete.location
watch(() => jobComplete.value.location, (newLocation) => {
    if (typeof newLocation === 'string') {
        try {
            parsedLocation.value = JSON.parse(newLocation)
        } catch (e) {
            console.error('Invalid location format', e)
            parsedLocation.value = null
        }
    } else {
        parsedLocation.value = newLocation
    }
}, { immediate: true })

//Exporta a pdf
const exportPdf = () => {

    const element = document.getElementById('content-to-pdf');
    const sanitizedFileName = `Trabajo_${jobComplete.value.name_job.replace(/\./g, '_')}.pdf`;

    html2pdf().from(element).set({
        margin: [10, 10, 10, 10], // top, left, bottom, right in mm
        filename: `${sanitizedFileName}`,
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

</script>

<style scoped>
.title {
    @apply text-gray-900 font-semibold;
}

.text {
    @apply text-sm text-gray-700;
}


</style>

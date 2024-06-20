<template>
    <div class="max-w-[95%] mt-5 mx-auto">
        <div class="flex flex-wrap gap-5 md:gap-10 justify-center mx-auto">
            <CardReport class="w-5/6 md:w-auto">
                <template #title>Trabajos completados</template>
                <template #text>{{ countJob }} completados</template>
                <template #icon>
                    <BriefcaseIcon />
                </template>
            </CardReport>

            <CardReport class="w-5/6 md:w-auto">
                <template #title>Valor del material</template>
                <template #text>{{ totalMaterial }} $</template>
                <template #icon>
                    <WrenchIcon />
                </template>
            </CardReport>

            <CardReport class="w-5/6 md:w-auto">
                <template #title>Valor de los equipos</template>
                <template #text>{{ totalEquipment }} $</template>
                <template #icon>
                    <WrenchScrewdriverIcon />
                </template>
            </CardReport>
        </div>

        <!--Graficos-->
        <div class="mt-6">
            <div class="flex flex-col md:flex-row gap-5">
                <div class="md:w-1/2 p-5 bg-white rounded-lg">
                    <p class="text-gray-600 text-center font-semibold">
                        Cantidad de trabajos en función del estado
                    </p>
                    <div v-if="loadJobStatus">
                        <Spinner />
                    </div>
                    <div v-else>
                        <bar-chart 
                            :data="report.transformedData" :colors="['#555']"
                            :download="{ background: '#fff', filename: 'Cantidad de trabajos' }">
                        </bar-chart>
                    </div>
                </div>

                <div class=" md:w-1/2 p-5 bg-white rounded-lg">
                    
                        <p class="w-full text-gray-600 text-center font-semibold">
                            Trabajos completados por local
                        </p>
                        <div v-if="loadJobEstablishment">
                            <Spinner />
                        </div>
                        <div v-else>
                            <pie-chart  
                                :data="countJobEstablishment"
                                :download="{ background: '#fff', filename: 'Cantidad de trabajos' }"
                            ></pie-chart>
                        </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '../../stores/report';
import { BriefcaseIcon, WrenchIcon, WrenchScrewdriverIcon } from "@heroicons/vue/24/solid";
import CardReport from '../../components/Utils/CardReport.vue';
import Spinner from '../../components/Spinner.vue'

const report = useReportStore()
const { countJob, totalMaterial, totalEquipment, loadJobStatus, countJobEstablishment,
    loadJobEstablishment } = storeToRefs(report)

onMounted(() => {
    report.getCountJobStatus()
    report.getCountJobEstablishment()
    report.getCountJob()
    report.getTotalMaterialValue()
    report.getTotalEquipmentValue()
})



</script>


<template>
    <div class="mx-auto">
        <p class="text-yellow-500 font-semibold tracking-wide text-lg">
            Historial de trabajos completados
        </p>
        <p class="text-gray-700 text-sm mt-2">En esta sección se mostrara todos los trabajos completados</p>
        <div class="mt-5 bg-white py-2 px-5">
            <div v-if="loadReportJob">
                <Spinner />
            </div>

            <div v-else>
                <div class="mb-5">
                    <SearchInput v-model:searchValue="search" />
                    <p class="text-xs font-semibold text-gray-500">Se puede buscar por el nombre del trabajo o el número de CAF</p>
                </div>

                <div class="rounded-xl">

                    <v-data-table
                        :headers="header" 
                        :items="filteredWorkOrdersStatus"
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        density="compact"
                    >
                        <template v-slot:item.job="{ item }">
                            <p class="text-gray-700 font-bold w-32 text-center mt-4">{{ item.job.name_job }}</p>
                            <div class="mb-5">
                                <v-img v-if="item.job.before_picture" :src="item.job.before_picture" cover class="h-24 w-36"></v-img>
                                <v-img v-else class="h-24 w-36" src="/trabajo.png"></v-img>
                            </div>
                        </template>

                        <template v-slot:item.num_caf="{ item }">
                            <div class="">
                                <div v-if="item.job.num_caf">
                                    <p>{{ item.job.num_caf}}</p>
                                </div>
                                <div v-else>
                                    <p class="text-red-500">No existe</p>
                                </div>
                            </div>
                        </template>

                
                        <template v-slot:item.description="{ item }">
                            <div class="">
                                <p>{{ item.job.description}}</p>
                            </div>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <div class="flex flex-col items-start gap-3">
                                
                                <RouterLink :to="{name: 'ViewCompleteWorkHead', params:{id: item.id_work_order}}">
                                    <div class="flex flex-row justify-center items-center cursor-pointer gap-1 text-orange-500 hover:text-orange-300">
                                        <EyeIcon class="w-5"/>
                                        <p>Ver</p>
                                    </div>
                                </RouterLink>
                       
                            
                                <RouterLink :to="{name: 'EditReportJobEmployee', params:{id: item.id_work_order}}">
                                    <div class="flex flex-row justify-center items-center cursor-pointer gap-1 text-green-500 hover:text-green-300"
                                        
                                        >
                                        <PencilIcon class="w-5 "/>
                                        <p>Editar</p>
                                    </div>
                                </RouterLink>
                
                            </div>
                        </template>

                    </v-data-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useWorkOrderStore } from '../../../stores/workOrders'
import { itemsOption } from '../../../helpers/utils'
import { PencilIcon, EyeIcon } from '@heroicons/vue/24/solid'
import Spinner from '../../../components/Spinner.vue';
import SearchInput from '../../../components/SearchInput.vue'

const workOrderStore = useWorkOrderStore()
const { search, loadReportJob} = storeToRefs(workOrderStore)

const statusJobId = ref(3) //Estado: Finalizado
const workFinish = ref([])

onMounted(async ()=> {
    workFinish.value = await workOrderStore.returnOrderCompleteByStatus(statusJobId.value)
})

const header = [
    { key: 'job', title: 'Trabajo' },
    { key: 'num_caf', title: 'Número de CAF' },
    { key: 'description', title: 'Descripción'},
    { title: 'Fechas', align: 'center', 
        children: [
            { key: 'assigned_date' , title:'Inicio'},
            { key: 'end_date' , title:'Fin'},
    ]},
    { key: 'actions' , title:'Acciones'},
]

const filteredWorkOrdersStatus = computed(() => {
    if (!search.value) return workFinish.value; 
    const searchValue = search.value.toLowerCase();
    return workFinish.value.filter(item => {
        const jobName = item.job.name_job.toLowerCase();
        const numCaf = item.job.num_caf ? item.job.num_caf.toLowerCase() : '';
        return jobName.includes(searchValue) || numCaf.includes(searchValue);
    });
});

</script>

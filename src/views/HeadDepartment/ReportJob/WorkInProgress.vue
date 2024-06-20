<template>
    <div class="mx-auto">
        <div class="mt-5 bg-white py-2 px-5">
            <div v-if="loadWorkOrder">
                <Spinner/>
            </div>

            <div v-else>
                <div class="my-5">
                    <div class=" flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10" >
                        <div class=" md:w-1/2" >
          
                            <v-text-field 
                                prepend-inner-icon="mdi-magnify"
                                v-model="search" 
                                placeholder="Nombre del material, trabajo o numero de CAF"
                                label="Buscar" 
                                variant="underlined" 
                                density="compact"
                                hide-details
                              
                            />

                        </div>
                        <div class=" md:w-1/2">
                            <v-select
                                v-model="selectStatusOrder"
                                label="Seleccione el estado de la ordén de trabajo"
                                variant="underlined" 
                                hide-details
                                :items="itemsSelect"
                                item-title="label"
                                item-value="key"
                                density="compact"
                            />
                      
                        </div>
                    </div>
                  
                    
                </div>
                <div class=" mb-10">
                    <p class=" font-semibold text-lg text-yellow-500"> {{ 
                            selectStatusOrder === 1 ? 
                                'Orden de trabajo creada' : 
                                'Orden de trabajo en progreso' }}  
                    </p>
                    <p class=" text-gray-700"> {{ selectStatusOrder === 1 ? 'Aquí se visualiza la orden de trabajo creada, junto con las fechas seleccionadas.' 
                    : 
                    'Estas son las órdenes de trabajo que actualmente están en proceso.' }}</p>
                </div>
                <div class=" rounded-xl">
                    <v-data-table
                        :headers="header" 
                        :items="workOrderStore.filteredWorkOrdersStatus"
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
                                
                                <button @click="openModalHandler(item.id_work_order)">
                                    <div class="flex flex-row justify-center items-center cursor-pointer gap-1 text-orange-500 hover:text-orange-300">
                                        <EyeIcon class="w-5"/>
                                        <p>Detalles</p>
                                    </div>
                                </button>

                                <RouterLink :to="{name: 'EditWorkOrderHead', params: {id: item.id_work_order}}">
                                    <div class=" flex flex-row justify-center items-center cursor-pointer gap-1 text-green-500 hover:text-green-300">
                                        <PencilIcon class="w-5"/>
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

    <!--Modal para ver detalles-->
    <v-dialog max-width="800" v-model="dialog">
        <v-card prepend-icon="mdi-eye-plus" title="Más detalles">
            <v-card-text>
                <div v-if="loadWorkComplete">
                    <Spinner />
                    <p class="text-center text-gray-700">Cargando ... </p>
                </div>
                <div v-else-if="!loadWorkComplete && workOrderIdHead"> 
         
                
                    <div class="bg-gray-50 rounded-lg overflow-y-auto mb-10">
                        <p class="font-semibold text-yellow-500 mb-5">{{ nameJobHead }} </p>

                        <div class="flex flex-col gap-6 md:flex-row mb-3">
                            <div class="w-full md:w-1/2">
                                <img :src="workOrderIdHead?.job?.before_picture || '/trabajo.png'"
                                class=" h-64 w-full object-cover rounded-md"
                                alt="Imagen de trabajo">
                            </div>

                            <div class="w-full md:w-1/2 space-y-1">
                                <div>
                                    <h4 class="title">Descripción: </h4>
                                    <p class="text">{{ workOrderIdHead.job.description }} </p>
                                </div>
                            </div>
                        </div>

                        
                        <div class="border-t-2 border-gray-400">
                            <p class="mt-5 font-semibold text-yellow-500 mb-5">Orden de trabajo</p>
                            <div class="flex flex-col md:flex-row gap-2">
                                <div class="w-full md:w-1/2">
                                    <h4 class="title">Instrucciones: </h4>
                                    <p class="text"> {{ workOrderIdHead.instructions }}</p>
                                </div>
                                <div class="w-full md:w-1/2">
                                    <div class="flex flex-col gap-1 text-gray-700">
                                        <p class="font-semibold">Fecha de Inicio:
                                            <span class=" font-normal">{{ workOrderIdHead.assigned_date }}</span>
                                        </p>
                                        <p class=" font-semibold">Fecha de Fin:
                                            <span class=" font-normal">{{ workOrderIdHead.end_date }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                
                        </div>

                        <div class="border-t-2 border-gray-400">
                            <p class="text-sm mt-5 font-semibold text-yellow-500">Detalles de la orden de trabajo</p>
                            <div class="flex flex-col md:flex-row gap-5 mt-4">
                                <div class="w-full md:w-1/2">
                                    <p class="text-yellow-500">Ubicación</p>
                                    <p class="title mb-2">Local: 
                                        <span class="text">{{  workOrderIdHead.job.establishment.name_establishment }}</span>
                                    </p>

                                    <div class="h-48">
                                        <LMap v-model:zoom="zoom" :center="workOrderIdHead.job.establishment.location"
                                            :use-global-leaflet="false">

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
                                            <div class="flex flex-wrap -mx-2">
                                                <div class="px-2">
                                                    <CardAssignedWorker v-for="user in workOrderIdHead.workers" :key="user.id_user"
                                                        :user="user" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 class="text-yellow-500 font-bold mb-3">Materiales asignados</h3>
                                            <div v-if="workOrderIdHead.material_assigned.length > 0">
                                                <div class="flex flex-wrap -mx-2">
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
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script setup>

import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkOrderStore } from '../../../stores/workOrders';
import { EyeIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { itemsOption } from '../../../helpers/utils'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import useLocationMap from '../../../composables/useLocationMap'
import Spinner from '../../../components/Spinner.vue';
import CardAssignedEquipment from '../../../components/Utils/CardAssignedEquipment.vue'
import CardAssignedMaterial from '../../../components/Utils/CardAssignedMaterial.vue'
import CardAssignedWorker from '../../../components/Utils/CardAssignedWorker.vue'
import { RouterLink } from 'vue-router';

const dialog = ref(false)
const selectStatusOrder = ref(1)

const { zoom } = useLocationMap()

const workOrderStore = useWorkOrderStore()
const { search, loadWorkComplete, loadWorkOrder, nameJobHead, workOrderIdHead} = storeToRefs(workOrderStore)

onMounted(() => {
    workOrderStore.getOrderCompleteByStatus(selectStatusOrder.value)
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

const itemsSelect = [
    { key: 1, label: 'Ordén de trabajo creada' },
    { key: 2, label: 'En progreso' },
];


const openModalHandler = async (id) => {
    dialog.value = true
    workOrderStore.getWorkCompleteByIdHead(id)

}

watch(selectStatusOrder, () => {
    workOrderStore.getOrderCompleteByStatus(selectStatusOrder.value)
    
})


</script>

<style scoped>

.title {
    @apply text-gray-700 font-semibold;
}

.text {
    @apply font-normal;
}
</style>
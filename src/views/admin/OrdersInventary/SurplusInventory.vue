<template>
    <div>
        <div class="flex flex-col">
            <div class="flex gap-3">
                <button @click="tab = 1">
                    <TabsText :selected="tab === 1">
                        <template #icon>
                            <WrenchIcon />
                        </template>
                        <template #text>Materiales</template>
                    </TabsText>
                </button>

                <button @click="tab = 2">
                    <TabsText :selected="tab === 2">
                        <template #icon>
                            <WrenchScrewdriverIcon />
                        </template>
                        <template #text>Equipos</template>
                    </TabsText>
                </button>
            </div>

            <div class="w-full bg-white shadows-2xl p-1  border-2 border-gray-200">

                <div class="mt-10 p-2">

                    <!--TABLA DE MATERIALES SOBRANTES-->
                    <div v-if="tab === 1">
                        <h4 class="text-lg text-yellow-500 font-semibold mb-3">Desalojo de materiales</h4>
                        <div class="rounded-2xl">
                            <v-data-table 

                                no-data-text="No hay desalojos por el momento" 
                                items-per-page-text="Mostrando"
                                :items-per-page-options="itemsOption" 
                                :items="dataReportMaterials"
                                :headers="headersMaterialReport" 
                                :loading="loading"
                            >

                                <template v-slot:item.actions="{ item }">
                                    <div class="my-3 flex flex-col gap-2">
                                        <button class="d-flex gap-1 cursor-pointer text-green-500 hover:text-green-300"
                                            @click="openModal(item)">
                                            <EyeIcon class="w-5" />
                                            <p>Detalles</p>
                                        </button>

                                        <button
                                            class="d-flex gap-1 cursor-pointer text-orange-500 hover:text-orange-300"
                                            @click="swalConfirmMaterial(item)"
                                            >
                                            <CheckCircleIcon class="w-5" />
                                            <p>Confirmar</p>
                                        </button>
                                    </div>
                                </template>
                            </v-data-table>
                        </div>
                    </div>


                    <!--TABLA DE EQUIPOS-->
                    <div v-else-if="tab === 2">

                        <h4 class="text-lg text-yellow-500 font-semibold mb-3">Desalojo de equipos</h4>
                        <div class=" rounded-2xl">
                            <v-data-table no-data-text="No hay desalojos por el momento" items-per-page-text="Mostrando"
                                :items-per-page-options="itemsOption" :items="equipmentEvictionData"
                                :headers="headersEquipmentEviction" :loading="loadEquipmentEviction">
                                <template v-slot:item.actions="{ item }">
                                    <div class="my-3 flex flex-col gap-2">
                                        <button class="d-flex gap-1 cursor-pointer text-green-500 hover:text-green-300"
                                            @click="openModelEquipment(item)">
                                            <EyeIcon class="w-5" />
                                            <p>Detalles</p>
                                        </button>

                                        <button
                                            class="d-flex gap-1 cursor-pointer text-orange-500 hover:text-orange-300"
                                            @click="swalConfirmEquipment(item)">
                                            <CheckCircleIcon class="w-5" />
                                            <p>Confirmar</p>
                                        </button>
                                    </div>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--Model para detalles del material-->
    <v-dialog width="600" v-model="dialog">
        <v-card prepend-icon="mdi-chevron-down" title="Detalles del desalojo">
            <v-card-text>
                <div class="flex flex-row gap-3">
                    <div class="w-1/2 shadow-md mb-2">
                        <img :src="materialComplete.image_material ? materialComplete.image_material : '/materiales.png'"
                            :alt="`Imagen del material ${materialComplete.name_material}`" class=" object-cover" />
                    </div>
                    <div class="w-1/2">
                        <div class="text-sm border-t-2 space-y-1 mb-2">
                            <h3 class="text-yellow-500 font-semibold mt-3">Material:
                                <span class="text-gray-700 font-normal">{{ materialComplete.name_material }}</span>
                            </h3>

                            <div>
                                <p class="font-semibold">Descripción: </p>
                                <p class="font-normal">{{ materialComplete.material_description }}</p>
                            </div>

                            <p class="font-semibold">Cantidad entregada: <span
                                    class="font-normal">{{ materialComplete.delivered_amount }}</span>
                            </p>

                            <p class="font-semibold">Cantidad sobrante: <span
                                    class="font-normal">{{ materialComplete.amount_left_over }}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!--TRABAJO-->
                <div class="text-sm border-t-2 space-y-1 ">
                    <h3 class="text-yellow-500 font-semibold mt-3">El material sobro en el trabajo:
                        <span class="text-gray-700 font-normal">{{ materialComplete.name_job }}</span>
                    </h3>
                    <p class="font-semibold">Número de CAF:
                        <span class="font-normal">{{ materialComplete.num_caf }}</span>
                    </p>
                    <p class="font-semibold">Descripción:
                        <span class="font-normal">{{ materialComplete.job_description }}</span>
                    </p>
                </div>

                <!--UBICACIÓN MAPA-->
                <div class="text-sm border-t-2 space-y-1">
                    <p class="mt-3 font-semibold text-yellow-500">Recoger en : </p>

                    <p class="font-semibold">Local:
                        <span class="font-normal">{{ materialComplete.name_establishment }} </span>
                    </p>

                    <div>
                        <p class="font-semibold">Dirección:</p>
                        <p>{{ materialComplete.establishment_description }}</p>
                    </div>

                </div>


            </v-card-text>
        </v-card>
    </v-dialog>


    <!--MODAL PARA DETALLES DEL DESALOJO DE EQUIPOS-->
    <v-dialog width="600" v-model="dialogEquipment">
        <v-card prepend-icon="mdi-chevron-down" title="Detalles del desalojo">
            <v-card-text>

                <!--Detalles equipo-->
                <div class="flex flex-row gap-3">
                    <div class="w-1/2 shadow-md mb-2">
                        <img :src="equipmentComplete.equipment_image ? equipmentComplete.equipment_image : '/equipamiento.png'"
                            :alt="`Imagen del material ${equipmentComplete.name_equipment}`" class=" object-cover" />
                    </div>
                    <div class="w-1/2">
                        <div class="text-sm border-t-2 space-y-1 mb-2">
                            <h3 class="text-yellow-500 font-semibold mt-3">Equipo:
                                <span class="text-gray-700 font-normal">{{ equipmentComplete.name_equipment }}</span>
                            </h3>

                            <div>
                                <p class="font-semibold">Descripción: </p>
                                <p class="font-normal">{{ equipmentComplete.equipment_description }}</p>
                            </div>

                        </div>
                    </div>
                </div>

                <!--TRABAJO-->
                <div class="text-sm border-t-2 space-y-1 ">
                    <h3 class="text-yellow-500 font-semibold mt-3">El material sobro en el trabajo:
                        <span class="text-gray-700 font-normal">{{ equipmentComplete.name_job }}</span>
                    </h3>
                    <p class="font-semibold">Número de CAF:
                        <span class="font-normal">{{ equipmentComplete.num_caf }}</span>
                    </p>
                    <p class="font-semibold">Descripción:
                        <span class="font-normal">{{ equipmentComplete.job_description }}</span>
                    </p>
                </div>

                <!--UBICACIÓN MAPA-->
                <div class="text-sm border-t-2 space-y-1">
                    <p class="mt-3 font-semibold text-yellow-500">Recoger en : </p>

                    <p class="font-semibold">Local:
                        <span class="font-normal">{{ equipmentComplete.name_establishment }} </span>
                    </p>

                    <div>
                        <p class="font-semibold">Dirección:</p>
                        <p>{{ equipmentComplete.establishment_description }}</p>
                    </div>

                </div>

            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { itemsOption } from '../../../helpers/utils'
import { useReportMaterialStore } from '../../../stores/reportMaterial';
import { EyeIcon, CheckCircleIcon, WrenchIcon, WrenchScrewdriverIcon, ClipboardDocumentCheckIcon }
    from '@heroicons/vue/24/solid'
import { useEquipmentAssigned } from '../../../stores/equipmentAssigned';
import Swal from 'sweetalert2'
import TabsText from '../../../components/TabsText.vue';

//Desalojo de materiales
const dialog = ref(false)
const materialComplete = ref({})
const reportMaterialStore = useReportMaterialStore()
const { loading, dataReportMaterials } = storeToRefs(reportMaterialStore)

//Desalojo de equipos
const dialogEquipment = ref(false)
const equipmentComplete = ref({})
const equipmentAssignedStore = useEquipmentAssigned()
const { equipmentEvictionData, loadEquipmentEviction } = storeToRefs(equipmentAssignedStore)

//Componente Tab
const tab = ref(1)
const headersMaterialReport = [

    { key: 'name_material', title: 'Material' },
    { key: 'material_description', title: 'Descripción' },
    { key: 'amount_left_over', title: 'Cantidad sobrante', align: 'center' },
    { key: 'delivered_amount', title: 'Cantidad asignada', align: 'center' },
    { key: 'name_establishment', title: 'Local' },
    { key: 'actions', title: 'Acciones' }
]

const headersEquipmentEviction = [
    { key: 'name_equipment', title: 'Equipo' },
    { key: 'equipment_description', title: 'Descripción' },
    { key: 'name_establishment', title: 'Local' },
    { key: 'actions', title: 'Acciones' }

]

const openModal = (item) => {
    dialog.value = true
    materialComplete.value = item
}

const openModelEquipment = (item) => {
    dialogEquipment.value = true
    equipmentComplete.value = item
}

watch(dialog, () => {
    if (dialog.value === false) {
        materialComplete.value = {}
    }
})

watch(dialogEquipment, () => {
    if (dialogEquipment.value === false) {
        equipmentComplete.value = {}
    }
})

onMounted(() => {
    equipmentAssignedStore.equipmentEviction()
    reportMaterialStore.reportMaterialByEviction()
})

const swalConfirmMaterial = (item) => {
    Swal.fire({
        title: 'Confirmar material sobrante',
        text: `Al aceptar confirma que la cantidad sobrante reportada del material: "${item.name_material}" regreso al inventario `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {

        if(result.isConfirmed) {
             reportMaterialStore.completedReportMaterial(item.id_report_material)
        }
    })
}

const swalConfirmEquipment = (item) => {

    Swal.fire({
        title: 'Confirmar desalojo de equipo',
        text: `Al aceptar confirma que el equipo regreso al inventario "${item.name_equipment}"`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {

        if(result.isConfirmed) {
            equipmentAssignedStore.completedEvictionEquipment(item.id_equipment_assigned)
        }
    })
}

</script>

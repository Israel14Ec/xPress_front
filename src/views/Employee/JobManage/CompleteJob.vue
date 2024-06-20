<template>
    <div class="mt-5 mx-auto max-w-[95%]  md:max-w-[90%]">
        <div class="flex flex-row text-xl gap-5 text-black">
            <RouterLink :to="{ name: 'WorkProgressEmployee' }">
                <ChevronLeftIcon class="w-5" />
            </RouterLink>

            <p class="font-semibold text-yellow-500">Trabajo: <span class="font-normal ml-3 text-gray-700">
                    {{ nameJob }} </span> </p>
        </div>

        <v-stepper v-model="step" :items="['Paso 1', 'Paso 2']" alt-labels>

            <template v-slot:item.1>
                <p class="text-gray-600 font-semibold mb-16">Confirmación de Finalización del Trabajo</p>
                <div v-if="load">
                    <Spinner />
                    <p class="text-red-500 text-center">Espere los datos están cargando</p>
                </div>

                <div v-else>
                    <div class="mt-5 flex flex-row gap-5 mb-5">
                        <div class="w-1/3">
                            <div class="h-56 shadow-xl rounded-lg p-2">
                                <img :src="selectedImage ?
                                    selectedImage : '/trabajo_completado.png'"
                                    class="h-full w-full object-contain rounded-md" alt="Imagen de trabajo">
                            </div>


                        </div>
                        <div class="w-1/2">
                            <div class="mb-5">
                                <p class="text-gray-500 text-sm mb-2">Adjunta una fotografía del trabajo completado para
                                    documentar su finalización.</p>
                
                                <FormKit v-model="image" type="file" name="image" 
                                    help="Seleccione una imagen (jpg, png, jpeg)" accept=".jpg,.png,.jpeg"
                                    fileRemoveIcon="close" fileItemIcon="fileImage" noFilesIcon="fileImage"
                                    validation="required" :validation-messages="{
                                        required: 'Se debe ingresar una imagen',
                                    }" @change="handleImageChange" />
                            </div>


                            <div>
                                <p class="text-gray-500 text-sm mb-2">Total de horas trabajadas</p>

                                <FormKit v-model="hourJob" type="number" validation="required|min:0" :validation-messages="{
                                    required: 'El valor es obligatorio',
                                    min: 'El valor debe ser mayor o igual a 0',
                                }" step="0.01" help="Horas" />
                            </div>

                        </div>

                    </div>
                </div>
            </template>

            <template v-slot:item.2>
             
                <div class="mb-5">
                    <p class="text-yellow-500 text-center text-lg mt-5 font-bold">Reportar Material Sobrante</p>
                    <p class="text-gray-700 text-sm mt-2 tracking-wide font-semibold">¿Existe material sobrante? </p>
                    <v-radio-group v-model="value" class="text-gray-600">
                        <v-radio label="Si" :value="true" class="text-xs"></v-radio>
                        <v-radio label="No" :value="false" class="text-xs"></v-radio>
                    </v-radio-group>

                </div>
                <div v-if="value">
                    <div class="flex flex-col md:flex-row gap-5">
                        <div class="w-full :w-1/2">
                            <p class="text-yellow-500 font-semibold mb-5 text-center">Lista de material asignado</p>
                            <SearchInput v-model:searchValue="search" />
             
                            <div class="rounded-lg mt-3">
                                <v-data-table :headers="headers" :items="workOrder.material_assigned"
                                    no-data-text="No hay datos disponibles" items-per-page-text="Mostrando"
                                    :items-per-page-options="itemsOption" :search="search" density="compact">
                                    <template v-slot:item.nombre_material="{ item }">
                                        <p class="text-center text-gray-700 font-bold">{{ item.name_material }}</p>
                                        <v-img v-if="item.image" :src="item.image" cover class="w-24 my-2"></v-img>
                                        <v-img v-else cover class="w-24" src="/materiales.png"></v-img>
                                    </template>

                                    <template v-slot:item.action="{ item }">
                                        <div class="flex justify-center">
                                            <CheckIcon class="w-6 cursor-pointer text-gray-500 hover:text-red-600"
                                                @click="reportMaterialHandler(item)" />

                                        </div>

                                    </template>

                                </v-data-table>
                            </div>


                        </div>
                        <div class="w-full :w-1/2 border-l-2 border-gray-400">
                            <div class="ml-4">
                                <p class="text-gray-700 mb-5 font-semibold text-center">Material Reportado</p>
                                <p v-if="reportMaterial.length === 0" class="text-sm text-red-500 text-center">No se ha
                                    seleccionado un material
                                </p>
                                <div v-else>
                                    <div v-for="material in reportMaterial" :key="material.id_material">
                                        <div
                                            class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                            <div>
                                                <p class="text-gray-600 font-semibold"> {{ material.name_material }}</p>
                                                <div class="text-sm">
                                                    <p>Cantidad asignada: {{ material.delivered_amount }}</p>
                                                    <p>Cantidad sobrante: <span class="text-red-500 font-semibold">
                                                            {{ material.quantity }}
                                                        </span> </p>
                                                </div>

                                            </div>
                                            <div class="flex flex-row gap-2 hover:cursor-pointer px-5">
                                                <PencilIcon @click="reportMaterialEdit(material)"
                                                    class="w-5 text-gray-700" />

                                                <TrashIcon
                                                    @click="workOrderStore.deleteReportMaterial(material.id_material)"
                                                    class="w-5 text-gray-700" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </template>

            <!-- BOTONES DEL STRIPPER -->

            <template v-slot:prev>
                <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900"
                    @click="workOrderStore.prevStep()"    
                    >
                    <ChevronLeftIcon />
                    <template #text>Regresar</template>
                </ButtonBlack>
            </template>

            <template v-slot:next>
                <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900" 
                    @click="workOrderStore.nextStep()"
                    >
                    <ChevronRightIcon />
                    <template #text v-if="step === 1">Siguiente</template>
                    <template #text v-else>Finalizar</template>
                </ButtonBlack>
            </template>


        </v-stepper>
    </div>
</template>

<script setup>

import { onMounted, ref, watch, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkOrderStore } from '../../../stores/workOrders'
import {
    ChevronLeftIcon, CheckIcon, PencilIcon, TrashIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/solid'
import UseImage from '../../../composables/useImage'
import Spinner from '../../../components/Spinner.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'
import SearchInput from '../../../components/SearchInput.vue'
import Swal from 'sweetalert2'

const search = ref()
const route = useRoute()
const workOrderStore = useWorkOrderStore()

const { showImage, selectedImage } = UseImage()

const { load, workOrder, nameJob, reportMaterial, image, hourJob, value, step
} = storeToRefs(workOrderStore)

const itemsOption = [
    5, 10, 15, -1
]

//Opciones para el encabezado
const headers = [
    { key: 'nombre_material', title: 'Material' },
    { key: 'description', title: 'Descripción' },
    { key: 'delivered_amount', title: 'Cantidas asignada', align: 'center' },
    { key: 'action', title: '' }
];

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};


const reportMaterialHandler = (item) => {
    Swal.fire({
        title: `Reporte de Material Sobrante`,
        html: `
            <div class="flex flex-col items-start">
                <p class="text-gray-600 text-left">¿Cuánto material de "${item.name_material}" sobró?</p> 
                
                <label class="text-gray-600 mt-6 mb-1" for="stock_quantity">Cantidad sobrante:</label>
                    <input class="w-full bg-gray-100 p-1 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:border-gray-400" 
                        type="number" 
                        id="stock_quantity"
                        min="1"
                        max="${item.delivered_amount}"
                        placeholder="Ingresa la cantidad"
                    />
                <p class="text-gray-500 text-sm mt-2">Cantidad asignada: <span class="text-red-500">${item.delivered_amount}</span> unidades.</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Reportar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const stockInput = document.getElementById('stock_quantity').value;
            const stockValue = parseInt(stockInput);
            if (stockValue > item.amount) {
                Swal.showValidationMessage(`La cantidad ingresada no es valida.`);
                return false;
            }

            if (stockValue <= 0 || isNaN(stockValue)) {
                Swal.showValidationMessage(`Por favor, ingrese un número válido.`);
                return false;
            }

            return { quantity: stockValue };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            item.quantity = result.value.quantity
            workOrderStore.addReportMaterial(item)
        }
    });
}


const reportMaterialEdit = (item) => {
    Swal.fire({
        title: 'Modificar cantidad sobrante',
        html: `
            <div class="flex flex-col items-start">
                <p class="text-gray-600 text-left"> 
                    Material: <strong>${item.name_material}</strong>
                </p>
                
                <label class="text-gray-600 mt-4 mb-2" for="stock_quantity">Ingrese la cantidad correcta:</label>
                  <input class="w-full bg-gray-100 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" 
                      type="number" 
                      id="stock_quantity"
                      min="0"
                      max="${item.amount}"
                      value="${item.quantity}"
                  />
                <p class="text-gray-500 text-sm mt-2">Cantidad asignada: <span class="text-red-500">${item.amount}</span> unidades.</p>
            </div>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const stockInput = document.getElementById('stock_quantity').value;
            const stockValue = parseInt(stockInput);
            if (stockValue > item.amount) {
                Swal.showValidationMessage(`La cantidad ingresada no es valida.`);
                return false;
            }

            if (stockValue < 0) {
                Swal.showValidationMessage(`Ingrese un número válido.`);
                return false;
            }

            return { quantity: stockValue };
        }
    }).then((result) => {
        if (result.isConfirmed) {

            workOrderStore.editReportMaterial({ ...item, quantity: result.value.quantity })
        }
    });
}

onMounted(() => {
    workOrderStore.getWorkOrderCompleteByID(route.params.id)
})

onUnmounted(() => {
    step.value = 1
    reportMaterial.value = [],
    image.value = '',
    hourJob.value = ''
})

//Cambia la imagen
watch(() => image.value, (newValue, oldValue) => {
    if (newValue.length === 0) {
        selectedImage.value = ''
    }
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
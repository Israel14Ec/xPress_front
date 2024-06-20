<template>
    <div class="max-w-[97%] mt-5 mx-auto">
        <div class="flex flex-row text-xl gap-5 text-black">
            
            <RouterLink :to="{ name: 'HomeDepartment' }">
                <ChevronLeftIcon class="w-5 hover:text-yellow-500" />
            </RouterLink>

            <p class="font-semibold text-yellow-500">Trabajo: <span class="font-normal ml-3 text-gray-700">
                    {{ jobData.name_job }}</span> 
            </p>
        </div>

        <div class="flex flex-col md:flex-row gap-2 md:gap-10 mb-5">
        </div>
        <div class="bg-white px-16 py-2 border-t-2 border-gray-400 mb-5">
            <h3 class="mb-3 text-sm text-gray-900 font-bold">Detalles del trabajo</h3>
            <div v-if="load">
                <Spinner />
            </div>

            <div v-else>
                <CardJob :job-data="jobData" />
            </div>
        </div>

        <div v-if="!load">
            <h4 class="text-lg font-bold my-4 text-center text-yellow-500">Orden de trabajo</h4>
            <v-stepper v-model="step" :items="['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4', 'Paso 5']" alt-labels>
            
                <template v-slot:item.1>
                    <v-card title="Crear orden de trabajo" flat>

                        <div class="mx-5 flex flex-col md:flex-row gap-5 mt-5">
                            <div class="w-full md:w-1/2">
                            <p class="text-yellow-500 font-semibold mb-5">Añadir detalles</p>

                            <FormKit type="textarea" name="description" v-model="instructions"
                                help="Instrucciones de trabajo"
                                placeholder="Añada las instrucciones para realizar el trabajo" label="Instrucciones" />
                        </div>

                        <div class="w-full md:w-1/2 space-y-3 border-l-2 border-gray-400">
                            <p class="text-center text-gray-700 font-bold">
                                Seleccione las fechas para cumplir con la orden de trabajo
                            </p>
                            <div class="max-w-[70%] mx-auto">
                                <div class="text-gray-700 text-sm font-semibold mt-5">
                                    <p>Fecha de Inicio:
                                        <span v-if="assignedDate[0]" class="font-normal">{{ assignedDate[0] }}</span>
                                        <span v-else class="font-normal text-red-500">
                                            No se selecciono
                                        </span>
                                    </p>
                                    <p>Fecha de Fin:
                                        <span v-if="assignedDate[1]" class="font-normal">{{ assignedDate[1] }} </span>
                                        <span v-else class="font-normal text-red-500">
                                            No se selecciono
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center justify-center">
                                <VueTailwindDatepicker :disable-date="disableDate" i18n="es-mx" as-single use-range no-input
                                    :formatter="formatter" :shortcuts="false" v-model="assignedDate" />
                            </div>
                        </div>

                    </div>

                </v-card>
            </template>

                <template v-slot:item.2>
                    <v-card title="Seleccione a los trabajadores" flat>
                        <div class="mt-5 md:mx-16">

                            <div class="flex flex-col md:flex-row gap-5">
                                <div class="md:w-1/2">
                                    <!--TRABAJADORES DISPONIBLES-->
                                    <div>   
                                        <p class="text-yellow-500 font-semibold mb-5">Lista de trabajadores disponibles </p>
                                        <div v-if="loading">
                                            <Spinner />
                                            <p class="text-center text-yellow-400 font-bold">Cargando los datos</p>
                                        </div>
                                        <div v-else>
                                            <div v-if="usersAvailable.length > 0">
                                                <CardUser v-for="user in usersAvailable" :key="user.id_user" :user="user" />
                                            </div>
                                            <div v-else>
                                                <p class="text-center text-yellow-400 font-bold">No hay trabajadores disponibles, 
                                                    en las fechas seleccionadas
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!--TRABAJADORES QUE YA ESTÁN ASIGNADOS-->
                                    <div v-if="isMaxPriority"
                                        class="mt-16 border-t-2 border-gray-300"
                                        >
                                        <p class="text-red-500 font-semibold mt-3">Trabajadores ya asignados</p>
                                        <p class="text-sm text-gray-600 mb-5">
                                            Debido a la alta prioridad del trabajo, se pueden asignar trabajadores previamente asignados para las fechas seleccionadas
                                        </p>
                                        <div v-if="usersNoAvailable.length > 0">
                                            <CardUser v-for="user in usersNoAvailable" :key="user.id_user" :user="user"/>
                                        </div>
                                        <div v-else>
                                            <p class="text-center text-yellow-400 font-bold"> No hay trabajadores asignados en dichas fechas</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="md:w-1/2 border-l-2 border-gray-400">
                                    <p class="text-gray-700 font-semibold text-center">Trabajadores seleccionados</p>

                                    <div class="p-5">

                                        <p v-if="usersSelect.length === 0" class="text-sm text-red-500 text-center">No se ha
                                            seleccionado un trabajador
                                        </p>

                                        <div v-else>
                                            <div v-for="user in usersSelect" :key="user.id_user">
                                                <div
                                                    class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                                    <div>
                                                        <p class="text-gray-600 font-semibold">
                                                            {{ user.name + " " + user.last_name }}</p>
                                                        <p class="text-sm">{{ user.phone_number }}</p>
                                                    </div>

                                                    <XCircleIcon @click="assignedStore.selectUserDelete(user.id_user)"
                                                        class="w-5 text-gray-600 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </template>

                <template v-slot:item.3>
                    <v-card title="Asigne materiales" flat>
                        <div class="flex flex-col xl:flex-row gap-5">

                            <div class="w-full xl:w-2/3">
                                <p class="text-yellow-500 font-semibold mb-5">Lista de materiales</p>
                          
                                <div class="mb-5">
                                    <SearchInput v-model:searchValue="search" />
                                </div>
              
                                <div class="rounded-lg">

                                    <v-data-table :headers="headers" :items="materials" no-data-text="No hay datos disponibles"
                                        items-per-page-text="Mostrando" :items-per-page-options="itemsOption" :search="search"
                                        density="compact">
                                        <template v-slot:item.nombre_material="{ item }">
                                            <p class="text-center text-gray-700 font-bold">{{ item.name_material }}</p>
                                            <v-img v-if="item.image" :src="item.image" cover class="w-24 my-2"></v-img>
                                            <v-img v-else cover class="w-24" src="/materiales.png"></v-img>

                                        </template>

                                        <template v-slot:item.check="{ item }">
                                            <div class="flex justify-center">
                                                <CheckIcon class="w-6 cursor-pointer text-gray-500 hover:text-red-600"
                                                    @click="assignStock(item)" />

                                            </div>

                                        </template>
                                    </v-data-table>
                                </div>

                            </div>

                            <div class="w-full xl:w-1/2 border-l-2 border-gray-400 px-5">

                                <p class="text-gray-700 font-semibold text-center">Materiales seleccionados</p>
                                <div class="mt-5">

                                </div>
                                <p v-if="materialSelected.length === 0" class="text-sm text-red-500 text-center">No se ha
                                    seleccionado un material
                                </p>
                                <div v-else>
                                    <div v-for="material in materialSelected" :key="material.id_material">

                                        <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                            <div>
                                                <p class="text-gray-600 font-semibold"> {{ material.name_material }}</p>
                                                <div class="text-sm">
                                                    <p>Stock disponible: {{ material.stock }}</p>
                                                    <p>Cantidad solicitada: {{ material.quantity }}</p>
                                                </div>

                                            </div>
                                            <div class="flex flex-row gap-2 hover:cursor-pointer px-5">
                                                <PencilIcon @click="assignStockEdit(material)" class="w-5 text-gray-700 hover:text-gray-500" />
                                                <TrashIcon @click="assignedStore.materialSelectDelete(material.id_material)"
                                                    class="w-5 text-gray-700 hover:text-gray-500" />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <button class="mt-16" @click="dialogMaterial = true">
                                        <p class="text-gray-700 hover:text-gray-400 text-sm">
                                            ¿Está disponible el material requerido en el inventario? Haz clic aquí para notificar.
                                        </p> 
                                </button>
                            </div>
                        </div>
                        
                        <!--Modal para solicitar equipo-->
                        <v-dialog
                            width="600"
                            v-model="dialogMaterial"
                        >
                            <v-card prepend-icon="mdi-bell" title="Notificar material">
                                <v-card-text>
                                    <FormKit
                                        type="form"
                                        :actions="false"
                                        incomplete-message="Revise las advertencias"
                                        @submit="notifyMaterial"
                                        v-model="dataNotify"
                                        >   
                                        <div class="border-b-2 mb-5">
                                            <p class="font-semibold">De: 
                                                <span class="font-normal">
                                                {{ from }}
                                                </span>
                                            </p>
                                            <p class=" font-semibold">Asunto:
                                                <span class=" font-normal">
                                                   {{ subject }}
                                                </span>
                                            </p>
                                        </div>
                                
                                        <FormKit
                                            type="text"
                                            label="Ingrese un título"
                                            placeholder="Para el trabajo se necesita el material ..."
                                            name="title"
                                            validation="required"
                                            :validation-messages="{
                                                required: 'Debe ingresar un título',
                                            }" 
        
                                        />
                                        <FormKit 
                                            type="textarea"
                                            label="Descripción"
                                            placeholder="Especifique el material que se necesita"
                                            name="description"
                                            validation="required"
                                            :validation-messages="{
                                                required: 'No se especifico los datos'
                                            }"
                                        />
                                        <FormKit 
                                            type="submit"   
                                        >Enviar
                                        </FormKit>
                                    </FormKit>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-card>
                </template>

                <template v-slot:item.4>
                    <v-card title="Asigne equipos de construcción" flat>
                        <div class="flex flex-col md:flex-row gap-5">

                            <div class="w-full md:w-1/2">
                                <p class="text-yellow-500 font-semibold mb-5">Lista de equipos</p>
                                <div class="mb-5 space-y-3">
                                    <SearchInput v-model:searchValue="searchEquipment" />
                                </div>

                                <div class="rounded-lg">
                                    <div v-if="assignedStore.load">
                                        <Spinner />
                                    </div>
                                    <div v-else>
                                        <v-data-table :headers="headersEquipment" :items="equipmentsType"
                                            no-data-text="No hay datos disponibles" items-per-page-text="Mostrando"
                                            :items-per-page-options="itemsOption" :search="searchEquipment">

                                            <template v-slot:item.check="{ item }">
                                                <div class="flex justify-center">
                                                    <CheckIcon class="w-6 cursor-pointer text-gray-500 hover:text-red-600"
                                                        @click="assignedStore.equipmentSelectAdd(item)" />
                                                </div>
                                            </template>

                                            <template v-slot:item.equipo="{ item }">

                                                <p class="text-center text-gray-700 font-bold">{{ item.name_equipment }}</p>
                                                <v-img v-if="item.image" :src="item.image" cover class="w-24 my-4"></v-img>
                                                <v-img v-else class="w-24" src="/equipamiento.png"></v-img>
                                            </template>

                                        </v-data-table>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 border-l-2 border-gray-400 px-5">
                                <p class="text-yellow-400 font-semibold text-center">Equipos seleccionados</p>
                                <div v-for="equipment in equipmentsSelect" :key="equipment.id_construction_equipment">
                                    <div class="flex justify-between mt-4 items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                        <div class="w-4/5">
                                            <p class="text-gray-600 font-semibold"> {{ equipment.name_equipment }}</p>
                                            <p class="text-gray-600 "> {{ equipment.description }}</p>
                                        </div>
                                        <div class=" w-1/5">
                                            <XCircleIcon
                                                @click="assignedStore.equipmentSelectDel(equipment.id_construction_equipment)"
                                                class="w-5 text-gray-600 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <button class="mt-16" @click="dialogEquipment = true">
                                    <p class="text-gray-700 hover:text-gray-400 text-sm">
                                        ¿Está disponible el equipo requerido en el inventario? Haz clic aquí para notificar.
                                    </p> 
                                </button>
                            </div>
                        </div>
                    </v-card>

                    <!--MODAL PARA EQUIPO-->
                    <v-dialog 
                        width="600"
                        v-model="dialogEquipment"
                        >
                        <v-card prepend-icon="mdi-bell" title="Notificar equipo">
                            <v-card-text>
                                <FormKit
                                    type="form"
                                    :actions="false"
                                    incomplete-message="Revise las advertencias"
                                    @submit="notifyEquipment"
                                    v-model="dataNotifyEquipment"
                                    >
                                    <div class="border-b-2 mb-5">
                                        <p class="font-semibold">De: 
                                            <span class="font-normal">{{ from }}</span>
                                        </p>
                                        <p class=" font-semibold">Asunto:
                                            <span class=" font-normal"> {{ subjectEquipment }}</span>
                                        </p>
                                    </div>

                                    <FormKit
                                        type="text"
                                        label="Ingrese un título"
                                        placeholder="Para el trabajo se necesita el material ..."
                                        name="title"
                                        validation="required"
                                        :validation-messages="{
                                            required: 'Debe ingresar un título',
                                        }" 
                                        />
                                        <FormKit 
                                            type="textarea"
                                            label="Descripción"
                                            placeholder="Especifique el material que se necesita"
                                            name="description"
                                            validation="required"
                                            :validation-messages="{
                                                required: 'No se especifico los datos'
                                            }"
                                        />
                                        <FormKit 
                                            type="submit"   
                                        >   Enviar
                                        </FormKit>
                                </FormKit>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </template>

                <template v-slot:item.5>
                    <v-card title="Resumen de orden" flat>
                        <div class="mt-5 text-gray-700">
                            <div class="border-y-2 p-2">
                                <h3 class="text-yellow-500 font-bold mb-5">Detalles</h3>

                                <div class="flex flex-col md:flex-row gap-10">
                                    <div class="md:w-1/2">
                                        <p class="font-semibold mb-5">Instrucciones: </p>
                                        <p>{{ instructions }}</p>
                                    </div>

                                    <div class="md:w-1/2 md:border-l-2 mx-auto">

                                        <div class="md:flex md:justify-center">
                                            <div>
                                                <p class="font-semibold mb-3">Fechas seleccionados: </p>
                                                <p>Fecha de Inicio {{ assignedDate[0] }}</p>
                                                <p>Fecha de Fin {{ assignedDate[1] }}</p>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="border-b-2 p-2">
                                <h3 class="text-yellow-500 font-semibold mb-5">Empleados seleccionados</h3>
                                <div class="flex flex-wrap -mx-2">
                                    <div v-for="user in usersSelect" :key="user.id_user"
                                        class="px-2 w-full">
                                        <div class="flex flex-row items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                            <div>
                                                <p class="text-gray-600 font-semibold"> {{ user.name + " " + user.last_name }}
                                                </p>
                                                <p class="text-sm">{{ user.phone_number }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="border-b-2 p-2">
                                <h3 class="text-yellow-500 font-bold mb-5">Material seleccionado</h3>
            
                                <div v-for="material in materialSelected" :key="material.id_material">
                                    <div class="">
                                        <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                            <div>
                                                <p class="text-gray-600 font-semibold"> {{ material.name_material }}</p>
                                                <div class="text-sm">
                                                    <p>Stock disponible: {{ material.stock }}</p>
                                                    <p>Cantidad solicitada: {{ material.quantity }}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="p-2">
                                <h3 class="text-yellow-500 font-bold mb-5">Equipos seleccionados</h3>
                            </div>

                            <div v-for="equipment in equipmentsSelect" :key="equipment.id_construction_equipment">
                                <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
                                    <div>
                                        <p class="text-gray-600 font-semibold"> {{ equipment.name_equipment }}</p>
                                        <p class="text-gray-600 "> {{ equipment.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-center">
                            <ButtonBlack class="bg-gray-900 hover:bg-gray-700 text-white"
                                @click="assignedStore.createWorkOrder(jobData.id_job)">
                                <CheckCircleIcon />
                                <template #text>Aceptar </template>
                            </ButtonBlack>
                        </div>

                        <div v-if="loadWorkOrder">
                            <Spinner />
                            <p class="text-center text-lg text-red-500">Creando la orden de trabajo</p>
                        </div>
                    </v-card>
                </template>

                <!-- BOTONES DEL STEPPER -->
                <template v-slot:prev>
                    <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900" @click="assignedStore.prevStep">
                        <ChevronLeftIcon />
                        <template #text>Regresar</template>
                    </ButtonBlack>
                </template>

                <template v-slot:next>
                    <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900" @click="assignedStore.nextStep">
                        <ChevronRightIcon />
                        <template #text>Siguiente</template>
                    </ButtonBlack>
                </template>
            </v-stepper>
        </div>
    </div>
  
</template>

<script setup>

import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useJobStore } from '../../../stores/job'
import { useAssignedWorkerStore } from '../../../stores/assignedWorker'
import { useMaterialStore } from '../../../stores/material'
import { useAuthStore } from '../../../stores/auth'
import { ChevronLeftIcon, XCircleIcon, CheckIcon, PencilIcon, TrashIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { disableDate, formatter, itemsOption } from '../../../helpers/utils'
import CardJob from '../../../components/Utils/CardJob.vue'
import Spinner from '../../../components/Spinner.vue'
import Swal from 'sweetalert2'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import CardUser from '../../../components/HeadComponents/CardUser.vue'
import SearchInput from '../../../components/SearchInput.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'

const route = useRoute()
const jobStore = useJobStore()
const assignedStore = useAssignedWorkerStore()
const materialStore = useMaterialStore()
const authStore = useAuthStore()

const statusEquipment = 3 //Estado Activo

const dialogMaterial = ref(false)
const dialogEquipment = ref(false)

const { load, jobData } = storeToRefs(jobStore)
const { loading, usersAvailable, usersSelect, instructions,
    materialSelected, equipmentsType, equipmentsSelect, assignedDate, step, loadWorkOrder, 
    isMaxPriority, usersNoAvailable
    } = storeToRefs(assignedStore)

const { materials } = storeToRefs(materialStore)

const search = ref()
const searchEquipment = ref()


//Notificacion
const subject = ref('') //Subject para materiales
const subjectEquipment = ref('') //Subject para equipo
const from = ref('')
const dataNotify = ref({}) //Notificación para material
const dataNotifyEquipment = ref({}) //Notificación para equipo

//Opciones para el encabezado
const headers = [
    { key: 'nombre_material', title: 'Material' },
    { key: 'description', title: 'Descripción' },
    { 
        title: 'Magnitud',
        align: 'center',
        children: [
            {key: 'value', title: 'Valor'},
            {key: 'symbol', title: 'Simbolo'},
            {key: 'name', title: 'Nombre'}
        ]
    },
    { key: 'stock', title: 'Stock disponible', align: 'center' },
    { key: 'check', title: '' }
];

const headersEquipment = [
    { key: 'equipo', title: 'Equipo' },
    { key: 'description', title: 'Descripción' },
    { key: 'name_type_equipment', title: 'Tipo' },
    { key: 'check', title: '' }
]



onMounted(async () => {
    jobData.value = await jobStore.getJobByIdJoin(route.params.id) //JobData
    assignedStore.getEquipmentByType(statusEquipment, 0) //Equipos
    subject.value = `Pedido de material que no esta disponible en el inventario, para el trabajo ${jobData.value.name_job }`
    subjectEquipment.value = `Pedido de equipo que no esta disponible en el inventario, para el trabajo ${jobData.value.name_job }`
    from.value = `${authStore.userData.name} ${authStore.userData.last_name}`
})


// --------------------------- CONTROLAR EL MATERIAL --------------------
const assignStock = (item) => {

    if (item.stock > 0) {
        Swal.fire({
            title: `Agregar material a la ordén de trabajo`,
            html: `
            <div class="flex flex-col items-start">
                <p class="text-gray-600 text-left"> Se agregara el material "${item.name_material}" a la orden de trabajo</p> 
                
                <label class="text-gray-600 mt-6 mb-1" for="stock_quantity">Cantidad solicitada: </label>
                    <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="number" 
                        id="stock_quantity"
                        min="1"
                        max="${item.stock}"
                    />
                <p class="text-gray-500 text-sm">Hay disponibilidad de <span class="text-red-500"> ${item.stock} </span></p>
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
                if (stockValue > item.stock) {
                    Swal.showValidationMessage(`Supero al stock disponible (${item.stock})`);
                    return false;
                }

                if (stockValue <= 0 || !stockValue) {
                    Swal.showValidationMessage(`No se ingreso un valor valido`);
                    return false;
                }

                return {
                    quantity: stockValue
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                assignedStore.addMaterialSelect({ ...item, quantity: result.value.quantity });
            }
        });
    } else {
        Swal.fire({
            title: 'Solicitar material',

        })
    }

}


const assignStockEdit = (item) => {
    Swal.fire({
        title: 'Editar cantidad solicitada',
        html: `
            <div class="flex flex-col items-start">
                <p class="text-gray-600 text-left font-semibold"> 
                    Material seleccionado: <span class="font-normal">${item.name_material} </span>
                </p>
                
                <label class="text-gray-600 mt-6 mb-1" for="stock_quantity">Cantidad solicitada: </label>
                  <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                      type="number" 
                      id="stock_quantity"
                      min="1"
                      max="${item.stock}"
                      value="${item.quantity}"
                  />
                <p class="text-gray-500 text-sm">Hay disponibilidad de <span class="text-red-500"> ${item.stock} </span></p>
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
            if (stockValue > item.stock) {
                Swal.showValidationMessage(`Supero al stock disponible (${item.stock})`);
                return false;
            }

            if (stockValue <= 0 || !stockValue) {
                Swal.showValidationMessage(`No se ingreso un valor valido`);
                return false;
            }

            return {
                quantity: stockValue
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            item.quantity = result.value.quantity
            assignedStore.materialSelectEdit(item)
        }
    })
}

//MODAL PARA MATERIAL
const notifyMaterial = async () => {
    dataNotify.value.subject = subject.value
    dataNotify.value.from = from.value
    dataNotify.value.id_user_from = authStore.userData.id_user 
    dataNotify.value.id_job = jobData.value.id_job
    
    //Llamo a la api
    await materialStore.notiMaterialUnavailable(dataNotify.value)
    dataNotify.value = {}
    dialogMaterial.value = false

}

//MODAL PARA EQUIPO
const notifyEquipment = async () => {
    dataNotifyEquipment.value.subject = subjectEquipment.value
    dataNotifyEquipment.value.from = from.value
    dataNotifyEquipment.value.id_user_from = authStore.userData.id_user
    dataNotifyEquipment.value.id_job = jobData.value.id_job

    //Llamo a la api
    await assignedStore.notiEquipmentUnavailable(dataNotifyEquipment.value)
    dataNotify.value = {}
    dialogEquipment.value = false
}

onUnmounted(() => {
    step.value = 1
    instructions.value = ''
    assignedDate.value = []
    usersSelect.value = []
    materialSelected.value = []
    equipmentsSelect.value = []
    from.value = ''
    subject.value = ''
})

</script>
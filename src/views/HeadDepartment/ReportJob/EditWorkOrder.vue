<template>
    <div class=" py-2 border-t-2 border-gray-400">
        <div class=" flex justify-between">
            <h3 class="text-sm text-gray-900 font-bold">Detalles de la orden de trabajo</h3>
            <RouterLink :to="{ name: 'JobInProgressHead' }">
                <ButtonBlack class=" bg-gray-100 hover:bg-gray-200">
                    <ArrowUturnLeftIcon />
                    <template #text>Regresar</template>
                </ButtonBlack>
            </RouterLink>

        </div>


        <div v-if="loadWorkOrder">
            <Spinner />
        </div>
        <div v-else>
            <div class="flex flex-col gap-6 md:flex-row mt-5 bg-white p-5">
                <div class="w-full md:w-1/3 shadow-xl p-1">
                    <img :src="job.before_picture ? job.before_picture : '/trabajo.png'"
                        class=" h-64 w-full object-cover rounded-md" alt="Imagen del trabajo" />
                </div>
                <div class="w-full md:w-2/3 space-y-1">
                    <div>
                        <div class="text-gray-900 flex flex-row gap-2 mb-3 items-end">
                            <h4 class="text-lg font-semibold">Trabajo:</h4>
                            <p class=" ">{{ job.name_job }}</p>
                        </div>
                        <div>
                            <h4 class="title">Número de CAF: </h4>
                            <p :class="{ 'text': job.num_caf, 'text-red-500 text-sm': !job.num_caf }">
                                {{ job.num_caf || 'No dispone de número de CAF' }}
                            </p>
                        </div>


                        <div>
                            <h4 class="text-gray-900 font-semibold">Descripción: </h4>
                            <p class="text"> {{ job.description }}</p>
                        </div>

                    </div>
                </div>
            </div>
            <div class="mt-5 bg-white p-5 rounded-lg">
                <h4 class="text-lg font-bold my-4 text-center text-yellow-500">Editar Orden de Trabajo</h4>
                <v-stepper editable v-model="step" :items="['Editar Detalles', 'Editar Materiales', 'Editar Equipos']"
                    alt-labels>

                    <template v-slot:item.1>
                        <v-card title="Editar detalles y empleados" flat>

                            <div class="mx-auto">
                                <div class="mx-5 flex flex-col md:flex-row gap-5 mt-5">
                                    <div class="w-full md:w-1/2">
                                        <p class="text-yellow-500 font-semibold mb-5">Añadir detalles</p>

                                        <FormKit type="textarea" name="description" help="Instrucciones de trabajo"
                                            placeholder="Añada las instrucciones para realizar el trabajo"
                                            label="Instrucciones" v-model="instructions" />
                                    </div>
                                    <div class=" w-full md:w-1/2 border-l-2 border-gray-400 ">
                                        <p class="text-center text-gray-700 font-bold">
                                            Fechas seleccionadas para la orden de trabajo
                                        </p>

                                        <div class="flex items-center justify-center px-5">
                                            <VueTailwindDatepicker i18n="es-mx" as-single use-range
                                                :formatter="formatter" :shortcuts="false" v-model="newDateWork"
                                                no-input />
                                        </div>

                                        <div class="px-10 mb-5">
                                            <div class="text-gray-700 text-sm font-semibold mt-5">
                                                <p class=" mb-2 text-red-500">Fechas seleccionadas</p>
                                                <p>Fecha de Inicio:
                                                    <span v-if="dateWork[0]"
                                                        class="font-normal">{{ dateWork[0] }}</span>
                                                </p>
                                                <p>Fecha de Fin:
                                                    <span v-if="dateWork[1]" class="font-normal">{{ dateWork[1] }}
                                                    </span>
                                                </p>
                                            </div>

                                            <div v-if="isNewDateExist" class="text-gray-700 text-sm font-semibold mt-5">
                                                <p class=" mb-2 text-red-500">Nuevas fechas seleccionadas</p>
                                                <p>Fecha de Inicio:
                                                    <span v-if="newDateWork[0]"
                                                        class="font-normal">{{ newDateWork[0] }}</span>
                                                    <span v-else class="font-normal text-gray-500">
                                                        No se selecciono
                                                    </span>
                                                </p>
                                                <p>Fecha de Fin:
                                                    <span v-if="newDateWork[1]" class="font-normal">{{ newDateWork[1] }}
                                                    </span>
                                                    <span v-else class="font-normal text-gray-500">
                                                        No se selecciono
                                                    </span>
                                                </p>
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                <div class="mt-5">
                                    <div class="mb-5">
                                        <p class="text-yellow-500 font-semibold text-center"> Asignación de empleados
                                        </p>
                                        <p v-if="isNewDateExist" class=" text-gray-700">Al cambiar las fechas de la
                                            ordén de trabajo se debe asignar a los empleados que esten disponibles en
                                            dichas fechas.</p>

                                    </div>


                                    <div v-if="loadWorker === true">
                                        <Spinner />
                                    </div>
                                    <div v-else>

                                        <div v-if="workerAvailable.length > 0">
                                            <div class=" flex md:flex-row  gap-5 items-start">
                                                <!--TRABAJADORES DISPONIBLES-->
                                                <div class="w-full md:w-1/2 space-y-3">
                                                    <div>
                                                        <p class="text-yellow-500 font-semibold mb-3">Lista de empleados
                                                            disponibles </p>

                                                    </div>

                                                    <CardEmployeEdit v-for="worker in workerAvailable"
                                                        :key="worker.id_user" :worker="worker" />
                                                </div>

                                                <!--TRABAJADORES SELECCIONADOS-->
                                                <div class="w-full md:w-1/2">
                                                    <div>
                                                        <p class="text-gray-500 font-semibold mb-3">Empleados
                                                            seleccionados </p>
                                                    </div>
                                                    <div v-if="workerSelect.length > 0">

                                                        <CardEmployeeSelect v-for="userSelect in workerSelect"
                                                            :key="userSelect.id_user" :worker="userSelect" />
                                                    </div>
                                                    <div v-else>
                                                        <p class="text-center text-gray-500 font-semibold">No se selecciono a algún trabajador
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                        <div v-else>
                                            <p class="text-center text-yellow-400 font-bold">
                                                No hay trabajadores disponibles, en las fechas seleccionadas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class=" mt-5 flex justify-center">
                                <button @click="editOrderStore.updateOrdersWithWorker(idWorkOrder)">
                                    <ButtonBlack class=" text-white bg-gray-900 hover:bg-gray-700">
                                        <CheckCircleIcon />
                                        <template #text>Guardar cambios</template>
                                    </ButtonBlack>
                                </button>

                            </div>
                        </v-card>
                    </template>

                    <template v-slot:item.2>
                        <v-card title="Editar asignación de materiales" flat>
                            <p>Dependiendo del estado en el que este la ordén de trabajo asignada recursos o en progreso
                                se puede realizar la edición o solicitar más material</p>

                            <div class="mt-5 border-t-2 mb-5">
                                <p class="text-yellow-500 font-semibold mb-1">Materiales Asignados</p>
                                <div v-if="materialAssigned.length > 0" class=" flex flex-wrap gap-5">

                                    <CardMaterialAssigned v-for="material in materialAssigned"
                                        :key="material.pivot.id_material_assigned" :material="material" />

                                </div>
                                <div v-else>
                                    <p class="text-gray-700">
                                        No se asignaron materiales para este trabajo, si se requiere seleccione de la
                                        lista
                                    </p>
                                </div>
                            </div>
                            <!--MATERIALES-->
                            <div class="flex flex-col xl:flex-row gap-5">
                                <div class=" w-full xl:w-2/3">
                                    <p class="text-yellow-500 font-semibold mb-5">Lista de materiales</p>

                                    <div class=" rounded-lg">
                                        <v-data-table :items="materialsAvailable" :loading="loadMaterialsAvailable"
                                            :headers="headersMaterials" no-data-text="No hay datos disponibles"
                                            items-per-page-text="Mostrando" density="compact"
                                            :items-per-page-options="itemsOption">

                                            <template v-slot:item.nombre_material="{ item }">
                                                <p class="text-center text-gray-700 font-bold">{{ item.name_material }}
                                                </p>
                                                <v-img v-if="item.image" :src="item.image" cover
                                                    class="w-24 my-2"></v-img>
                                                <v-img v-else cover class="w-24" src="/materiales.png"></v-img>
                                            </template>

                                            <template v-slot:item.check="{ item }">
                                                <div class="flex justify-center">
                                                    <CheckIcon
                                                        class="w-6 cursor-pointer text-gray-500 hover:text-red-600"
                                                        @click="assignStock(item)" />
                                                </div>

                                            </template>
                                        </v-data-table>
                                    </div>
                                </div>

                                <div class="w-full xl:w-1/2 border-l-2 border-gray-400 px-5">
                                    <p class="text-gray-700 font-semibold text-center mb-5">Materiales seleccionados</p>
                                    <div class=" mt-5">
                                        <p v-if="materialSelected.length === 0"
                                            class="text-sm text-red-500 text-center">No se ha
                                            seleccionado un material
                                        </p>
                                        <div v-else>

                                            <CardMaterialAssignedEdit v-for="material in materialSelected"
                                                :key="material.id_material" :material="material" />
                                        </div>
                                    </div>

                                    <button class="mt-16" @click="dialogMaterial = true">
                                        <p class="text-gray-700 hover:text-gray-400 text-sm">
                                            ¿Está disponible el material requerido en el inventario? Haz clic aquí para
                                            notificar.
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div class=" flex flex-row justify-center mt-5">
                                <button @click="editOrderStore.createAssignedMaterial(idWorkOrder)">
                                    <ButtonBlack class=" bg-gray-900 hover:bg-gray-700 text-white">
                                        <CheckCircleIcon />
                                        <template #text>Solicitar material</template>
                                    </ButtonBlack>
                                </button>
                            </div>
                        </v-card>
                    </template>

                    <template v-slot:item.3>

                        <v-card title="Editar pedidos de equipos" flat>

                            <p>Se puede eliminar el pedido de equipo cuando este no ha sido marcado como entregado</p>

                            <div class="mt-5 border-t-2 mb-5">
                                <p class="text-yellow-500 font-semibold mb-1">Equipos Asignados</p>
                                <div v-if="equipmentAssigned.length > 0">
                                    <CardEquipmentAssigned v-for="equipment in equipmentAssigned"
                                        :key="equipment.pivot.id_equipment_assigned" :equipment="equipment" />
                                </div>
                                <div v-else>
                                    <p class="text-gray-700">
                                        No se asignaron equipos para este trabajo, si se requiere seleccione de la
                                        lista
                                    </p>
                                </div>
                            </div>

                            <div class="flex flex-col xl:flex-row gap-5">
                                <div class="w-full xl:w-1/2">
                                    <p class="text-yellow-500 font-semibold mb-5">Lista de equipos</p>
                                    <div class=" rounded-lg">
                                        <div>
                                            <v-data-table :loading="loadEquipment" :headers="headersEquipment"
                                                :items="equipmentType" no-data-text="No hay datos disponibles"
                                                items-per-page-text="Mostrando" density="compact"
                                                :items-per-page-options="itemsOption">
                                                <template v-slot:item.equipo="{ item }">
                                                    <p class="text-center text-gray-700 font-bold">
                                                        {{ item.name_equipment }}</p>
                                                    <v-img v-if="item.image" :src="item.image" cover
                                                        class="w-24 my-2"></v-img>
                                                    <v-img v-else cover class="w-24" src="/materiales.png"></v-img>
                                                </template>

                                                <template v-slot:item.check="{ item }">
                                                    <div class="flex justify-center">
                                                        <CheckIcon
                                                            class="w-6 cursor-pointer text-gray-500 hover:text-red-600"
                                                            @click="editOrderStore.addEquipmentSelect(item)" />
                                                    </div>
                                                </template>

                                            </v-data-table>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full xl:w-1/2 border-l-2 border-gray-400 px-5">
                                    <p class="text-yellow-400 font-semibold text-center">Equipos seleccionados</p>
                                    <div class=" mt-5">
                                        <p v-if="equipmentSelect.length === 0" class="text-sm text-red-500 text-center">
                                            No se selecciono ningún equipo
                                        </p>

                                        <div v-else>
                                            <CardEquipmentSelect v-for="equipment in equipmentSelect"
                                                :key="equipment.id_construction_equipment" :equipment="equipment" />
                                        </div>
                                    </div>
                                    <button class="mt-16" @click="dialogEquipment = true">
                                        <p class="text-gray-700 hover:text-gray-400 text-sm">
                                            ¿Está disponible el equipo requerido en el inventario? Haz clic aquí para
                                            notificar.
                                        </p>
                                    </button>

                                </div>
                            </div>

                            <div class=" flex flex-row justify-center mt-5">
                                <button @click="editOrderStore.createAssignEquipment(idWorkOrder)">
                                    <ButtonBlack class=" bg-gray-900 hover:bg-gray-700 text-white">
                                        <CheckCircleIcon />
                                        <template #text>Solicitar equipo</template>
                                    </ButtonBlack>
                                </button>
                            </div>
                        </v-card>
                    </template>

                    <!--Botones del v-stepper-->
                    <template v-slot:prev>
                        <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900"
                            @click="editOrderStore.prevStep()">
                            <ChevronLeftIcon />
                            <template #text>Regresar</template>
                        </ButtonBlack>
                    </template>

                    <template v-slot:next>
                        <ButtonBlack class="bg-gray-50 hover:bg-gray-200 text-gray-900"
                            @click="editOrderStore.nextStep()">
                            <ChevronRightIcon />
                            <template #text>Siguiente</template>
                        </ButtonBlack>
                    </template>
                </v-stepper>
            </div>

        </div>
    </div>


    <!--MODAL PARA SOLICITAR MATERIAL-->
    <v-dialog width="600" v-model="dialogMaterial">
        <v-card prepend-icon="mdi-bell" title="Notificar material">
            <v-card-text>
                <FormKit type="form" :actions="false" incomplete-message="Revise las advertencias"
                    @submit="notifyMaterial" v-model="dataNotify">
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

                    <FormKit type="text" label="Ingrese un título"
                        placeholder="Para el trabajo se necesita el material ..." name="title" validation="required"
                        :validation-messages="{
                            required: 'Debe ingresar un título',
                        }" />
                    <FormKit type="textarea" label="Descripción" placeholder="Especifique el material que se necesita"
                        name="description" validation="required" :validation-messages="{
                            required: 'No se especifico los datos'
                        }" />
                    <FormKit type="submit">Enviar
                    </FormKit>
                </FormKit>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!--MODAL PARA SOLICITAR EQUIPO-->
    <v-dialog width="600" v-model="dialogEquipment">
        <v-card prepend-icon="mdi-bell" title="Notificar equipo">
            <v-card-text>
                <FormKit type="form" :actions="false" incomplete-message="Revise las advertencias"
                    @submit="notifyEquipment" v-model="dataNotifyEquipment">
                    <div class="border-b-2 mb-5">
                        <p class="font-semibold">De:
                            <span class="font-normal">{{ from }}</span>
                        </p>
                        <p class=" font-semibold">Asunto:
                            <span class=" font-normal"> {{ subjectEquipment }}</span>
                        </p>
                    </div>

                    <FormKit type="text" label="Ingrese un título"
                        placeholder="Para el trabajo se necesita el material ..." name="title" validation="required"
                        :validation-messages="{
                            required: 'Debe ingresar un título',
                        }" />
                    <FormKit type="textarea" label="Descripción" placeholder="Especifique el material que se necesita"
                        name="description" validation="required" :validation-messages="{
                            required: 'No se especifico los datos'
                        }" />
                    <FormKit type="submit"> Enviar
                    </FormKit>
                </FormKit>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouterLink } from 'vue-router'
import { useEditWorkOrderStore } from '../../../stores/EditWorkOrder';
import { useAuthStore } from '../../../stores/auth';
import { formatter } from '../../../helpers/utils'
import { ArrowUturnLeftIcon, CheckCircleIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { itemsOption } from '../../../helpers/utils'
import Spinner from '../../../components/Spinner.vue'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import CardEmployeEdit from '../../../components/HeadComponents/CardEmployeEdit.vue';
import CardEmployeeSelect from '../../../components/HeadComponents/CardEmployeeSelect.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue'
import CardMaterialAssigned from '../../../components/HeadComponents/CardMaterialAssigned.vue';
import CardMaterialAssignedEdit from '../../../components/HeadComponents/CardMaterialAssignedEdit.vue';
import Swal from 'sweetalert2'
import CardEquipmentAssigned from '../../../components/HeadComponents/CardEquipmentAssigned.vue';
import CardEquipmentSelect from '../../../components/HeadComponents/CardEquipmentSelect.vue';

const idWorkOrder = ref()
const route = useRoute()
const editOrderStore = useEditWorkOrderStore()
const authStore = useAuthStore()


//V-DIALOG para materiales
const dialogMaterial = ref(false)
const dataNotify = ref({}) //Notificación para material
const dataNotifyEquipment = ref({}) 

//V-DIALOG para equipments
const dialogEquipment = ref(false)

const { loadWorkOrder, instructions,
    job,
    materialAssigned, equipmentAssigned, step, dateWork, newDateWork,
    loadWorker, workerAvailable, isNewDateExist, workerSelect,
    materialsAvailable, loadMaterialsAvailable, materialSelected,
    from, subject, loadEquipment, equipmentType, equipmentSelect, subjectEquipment
} = storeToRefs(editOrderStore)

const statusEquipment = 3 //Estado Activo

const headersMaterials = [
    { key: 'nombre_material', title: 'Material' },
    { key: 'description', title: 'Descripción' },
    {
        title: 'Magnitud',
        align: 'center',
        children: [
            { key: 'value', title: 'Valor' },
            { key: 'symbol', title: 'Simbolo' },
            { key: 'name', title: 'Nombre' }
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


//Agregar al material
const assignStock = (item) => {
    if (item.stock > 0) {
        Swal.fire({
            title: 'Agregar material a la ordén de trabajo',
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
                editOrderStore.addMaterialSelected({ ...item, quantity: result.value.quantity })
            }
        })
    } else {
        Swal.fire({
            title: 'Solicitar material',
        })
    }
}

//Notificar el material
const notifyMaterial = async () => {
    dataNotify.value.subject = subject.value
    dataNotify.value.from = from.value
    dataNotify.value.id_user_from = authStore.userData.id_user
    dataNotify.value.id_job = job.value.id_job

    //Llamo a la api
    await editOrderStore.notiMaterialUnavailable(dataNotify.value)
    dataNotify.value = {}
    dialogMaterial.value = false
}

//MODAL PARA EQUIPO
const notifyEquipment = async () => {
    dataNotifyEquipment.value.subject = subjectEquipment.value
    dataNotifyEquipment.value.from = from.value
    dataNotifyEquipment.value.id_user_from = authStore.userData.id_user
    dataNotifyEquipment.value.id_job = job.value.id_job

    //Llamo a la api
    await editOrderStore.notiEquipmentUnavailable(dataNotifyEquipment.value)
    dataNotify.value = {}
    dialogEquipment.value = false
}

onMounted(() => {
    idWorkOrder.value = route.params.id
    editOrderStore.getWorkOrderCompleteById(idWorkOrder.value)
    editOrderStore.getMaterials()
    editOrderStore.getEquipmentByType(statusEquipment, 0)
    
})


onUnmounted(() => {
    materialSelected.value = []
    step.value = 1
    equipmentSelect.value = []
    newDateWork.value = []
    dateWork.value = []
})

</script>

<style scoped>
.title {
    @apply text-gray-900 font-semibold inline-block mr-2;
}

.text {
    @apply text-sm inline-block;
}
</style>
<template>
    <div class="mb-10 border-b-2 border-gray-500 p-5 page-break-before">   
        <p class="text-lg mb-10 mt-5 font-semibold text-yellow-500 text-center">Orden de trabajo</p> 
        <div class="flex flex-col md:flex-row gap-5 items-start">
            <div class="w-full md:w-1/2">
                <div class="mb-4" v-if="workOrder.department">
                    <p class="text-gray-900 font-semibold text-lg"> Departamento:
                        <span class=" font-normal">{{ workOrder.department.name_department }}</span>
                    </p>
                </div>

                <p class="title">Instrucciones</p>
                <p class="text">{{ workOrder.instructions }}</p>
            </div>
            <div class="w-full md:w-1/2">
                <div class="">
                    <p class="title">Fecha de Comienzo: <span class="text">{{ workOrder.assigned_date }}</span> </p>
                </div>
                <div class="">
                    <p class="title">Fecha de Fin: <span class="text">{{ workOrder.end_date }}</span> </p>
                </div>
                <div class="">
                    <p class="title">Tiempo trabajado: <span class="text">{{ workOrder.hour_job }} horas</span> </p>
                </div>
            </div>
        </div>
        <div v-if="workOrder.after_picture.length" class=" flex flex-wrap gap-5">
            <div v-for="(imageUrl, index) in workOrder.after_picture" :key="index"
                class="m-2 bg-gray-50 shadow rounded-lg p-1">
                <img :src="imageUrl" alt="Imagen" class="w-40 h-40 object-contain">
            </div>
        </div>
        <div v-else>
            <p class="alert">No hay fotografías disponibles</p>
        </div>

        <!--TRABAJADORES ASIGNADOS-->
        <div>
            <h3 class="text-yellow-500 font-semibold mb-3">Trabajadores asignados</h3>
            <div class="mt-2" v-if="workOrder.workers.length">
                <div>
                    <div class="">
                        <div class="px-2 flex flex-wrap gap-5">
                            <CardAssignedWorker v-for="user in workOrder.workers" :key="user.id_user" :user="user" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="alert">No se cargaron los trabajadores</p>
            </div>
        </div>


        <!--MATERIALES ASIGNADOS-->
        <div>
            <h3 class="text-yellow-500 font-semibold mb-3">Materiales asignados</h3>
            <div v-if="workOrder.material_assigned.length > 0">
                <div>
                    <div class="px-2">
                        <CardAssignedMaterial v-for="material in workOrder.material_assigned" :key="material.id_material"
                            :material="material" />
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="alert">No se asigno materiales</p>
            </div>
        </div>

        <!--EQUIPOS ASIGNADOS-->
        <div>
            <h3 class="text-yellow-500 font-semibold mb-3">Equipos asignados</h3>
            <div v-if="workOrder.equipment_assigned.length > 0">
                <CardAssignedEquipment v-for="equipment in workOrder.equipment_assigned"
                    :key="equipment.id_construction_equipment" :equipment="equipment" />
            </div>
            <div v-else>
                <p class="alert">No se asigno equipos</p>
            </div>
        </div>
    </div>

</template>

<script setup>

import CardAssignedWorker from '../../components/Utils/CardAssignedWorker.vue';
import CardAssignedMaterial from '../../components/Utils/CardAssignedMaterial.vue';
import CardAssignedEquipment from '../../components/Utils/CardAssignedEquipment.vue';


const props = defineProps({
    workOrder: {
        type: Object,
        required: true
    }
})


</script>

<style scoped>
.title {
    @apply text-gray-800 font-semibold mb-1;
}

.text {
    @apply text-sm text-gray-700 font-normal;
}

.alert {
    @apply text-center mt-5 text-red-500;
}

.page-break-before {
    page-break-before: always;
}


</style>

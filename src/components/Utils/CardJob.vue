<template>
    <div class="flex flex-col gap-6 md:flex-row">
        <div class="w-full md:w-1/3 shadow-xl p-1">
            <img :src="jobData.before_picture || '/trabajo.png'" class=" h-64 w-full object-cover rounded-md"
                alt="Imagen de trabajo">
        </div>

        <div class="w-full md:w-2/3 space-y-1">

            <div>
                <h4 class="title">Número de CAF: </h4>
                <p :class="{ 'text': jobData.num_caf, 'text-red-500 text-sm': !jobData.num_caf }">
                    {{ jobData.num_caf || 'No dispone de número de CAF' }}
                </p>

            </div>

            <div class="flex flex-row gap-2 items-center">
                <h4 class="title">Prioridad: </h4>
                <p :class="jobData.level_priority === MAX_PRIORITY ? 'text-red-500 text-lg border-b-2 border-red-400' : 'text'">
                    {{ jobData ? jobData.name_priority : '' }}
                </p>

            </div>


            <div>
                <h4 class="text-gray-900 font-semibold">Descripción: </h4>
                <p class="text"> {{ jobData.description }}</p>
            </div>

            <div class="flex flex-row gap-5">
                <div class="w-1/2 space-y-3">
                    <div>
                        <h4 class="title">Cliente: </h4>
                        <p class="text"> {{ jobData.name_client }}</p>
                    </div>

                    <div>
                        <h4 class="title">Medio de comunicación: </h4>
                        <p class="text"> {{ jobData.name_communication }}</p>
                    </div>

                    <div>
                        <h4 class="title">Local: </h4>
                        <p class="text"> {{ jobData.name_establishment }}</p>
                    </div>
                </div>
                <div class="w-1/2 space-y-3">

                    <div>
                        <h4 class="title">Tipo de mantenimiento: </h4>
                        <p class="text"> {{ jobData.name_maintenance }}</p>
                    </div>

                    <div>
                        <h4 class="title">Fecha de asignación: </h4>
                        <p class="text"> {{ jobData.start_date }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="jobData.departments && jobData.departments.length !== 0">
        <h3 class="mt-5 mb-3 text-lg font-semibold text-yellow-500">
            Este trabajo también se asignó a otro departamento.
             Por favor, contacte con el jefe de ese departamento para coordinar la orden de trabajo.
        </h3>

        <div v-for="department in jobData.departments" :key="department.id_department">
            <div class="bg-gray-100 py-2 px-5 rounded-lg">
                <h4 class="font-semibold text-gray-700">Departamento: {{ department.name_department }}</h4>
                <div class="text-sm" v-for="user in department.users" :key="user.id_user">
                    <p class="text-gray-600 font-semibold">
                       Nombre: <span class="font-normal">{{ user.name }} {{ user.last_name }}</span>
                    </p>
                    <p class="text-gray-600 font-semibold">
                       Correo: <span class="font-normal">{{ user.email }} </span>
                    </p>
                    <p class="text-gray-600 font-semibold">
                       Número de teléfono: <span class="font-normal">{{ user.phone_number }} </span>
                    </p>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>

import { ref } from 'vue'

const MAX_PRIORITY = ref(1)
const props = defineProps({
    jobData: Object
});

</script>

<style scoped>
.title { 
    @apply text-gray-900 font-semibold inline-block mr-2
}
.text {
    @apply text-sm inline-block
}
</style>

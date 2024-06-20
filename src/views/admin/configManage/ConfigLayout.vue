<template>
    <div class="max-w-[95%] mt-5 mx-auto">
        <div class="flex flex-col md:flex-row gap-2 md:gap-10">
            <TextLink 
                v-for="option in optionRoute"
                :key="option.route"
                :to="option.route"
            >
                {{ option.label }}
            </TextLink>
            
        </div>

        <RouterView class=" bg-white p-2 rounded-lg">
        </RouterView>

    </div>
</template>

<script setup>
    
import { RouterView } from "vue-router";
import TextLink from "../../../components/TextLink.vue";

const optionRoute = [
    {route: 'Clients', label: 'Clientes'},
    {route: 'MaintenanceType', label: 'Tipos de mantenimiento'},
    {route: 'JobStatus', label: 'Estados de trabajo'},
    {route: 'JobPriorities', label: ' Prioridades'},
    {route: 'CommunicationType', label: 'Tipos de comunicación'},
    {route: 'departmentManage', label: 'Departamentos'},
]

</script>


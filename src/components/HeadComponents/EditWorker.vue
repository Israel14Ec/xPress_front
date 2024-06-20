<template>
     <div class="bg-white p-4 rounded-2xl mt-16">
        <p class="text-xl text-center text-gray-600 font-semibold">
            {{ option === 1 ? 'Modificar acceso' : 'Usuarios eliminados' }}
        </p>

        <p v-if="option === 2" class="text-red-500 font-semibold mb-5 text-center">Restaure el acceso de la aplicación a los empleados</p>

        <div class="flex flex-row gap-3 justify-between items-end mx-auto">

            <div class="w-1/3">
                <SearchInput v-model:searchValue="search"/>
            </div>
            <div>
                <ButtonBlack v-if="option === 1" class="bg-red-500 text-white hover:bg-red-400" 
                    @click="option = 2"
                >
                    <XCircleIcon/>
                    <template #text>Empleados eliminados</template>
                </ButtonBlack>

                <ButtonBlack v-if="option === 2" class="bg-gray-700 text-white hover:bg-gray-500" 
                    @click="option = 1"
                >
                    <UserCircleIcon/>
                    <template #text>Empleados activos</template>
                </ButtonBlack>

            </div>
        </div>
        
        <div class="mt-10">
            <div v-if="loading">
                <Spinner/>
            </div>
            <div v-else>
                <div class="rounded-lg">
                    <div v-if="option == 1">
                        <v-data-table
                            :headers="headers"
                            :items="usersRol"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >
                            <template v-slot:item.actions="{ item }">
                                <button class="flex flex-row gap-1 my-4 text-red-500 hover:text-red-500"  
                                    @click="deleteHandler(item)"
                                >
                                    <TrashIcon class="w-5"/>
                                    <p>Quitar</p>
                     
                                </button>
                            </template>
                        </v-data-table>
                    </div>

                    <div v-else>
                        
                        <v-data-table
                            :headers="headers"
                            :items="usersInvalid"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >
                            <template v-slot:item.actions="{ item }">
                                <button class="flex flex-row gap-1 text-green-500 hover:text-green-300 my-4"
                                    @click="restoreHandler(item)"
                                >
                                    <ArrowUturnRightIcon class="w-5"/>
                                    <p>Restaurar</p>
                                    
                                </button>
                            </template>
                        </v-data-table>
                    </div>
                   
                </div>
            </div>
        </div>
     </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/user'
import { useAuthStore } from '../../stores/auth';
import {TrashIcon, XCircleIcon, UserCircleIcon, ArrowUturnRightIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'
import Spinner from '../Spinner.vue';
import ButtonBlack from '../ButtonBlack.vue';
import SearchInput from '../SearchInput.vue';

const userStore = useUserStore()
const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)
const { usersRol, usersInvalid, loading } = storeToRefs(userStore)
const search = ref()
const option = ref(1)
const rol = 3

onMounted(() => {
    userStore.allUser( userData.value.id_department, rol)
    userStore.getRemoveAccessDepartment(userData.value.id_department)
})

const headers = [
    { key: 'name', title: 'Nombre' },
    { key: 'last_name', title: 'Apellido' },
    { key: 'phone_number', title: 'Teléfono'},
    { key: 'email', title: 'Correo'},
    { key: 'actions', title: 'Acciones'}
];

const itemsOption = [
    5, 10, 15, -1
]

const deleteHandler = (item) => {
    Swal.fire({
        title: 'Quitar Acceso',
        text: `Se quitara el acceso al empleado "${item.name} ${item.last_name}"`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            userStore.deleteLogicDep(item)
        }
    })
}

const restoreHandler = (item) => {
    Swal.fire({
        title: 'Restaurar Accesso',
        text: `Se restaurara el acceso al empleado "${item.name} ${item.last_name}"`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if(result.isConfirmed) {
            item.id_rol = rol
            userStore.restoreUserDep(item)
        }
    })
}

</script>

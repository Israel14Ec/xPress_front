<template>
    <div class="bg-white p-4 rounded-2xl mt-5">
        <p class="text-xl text-center text-gray-600 font-semibold">Dar acceso a los empleados</p>
        <SearchInput class="w-60" v-model:searchValue="search"/>
        <div class="mt-10">

            <div v-if="loading">
                <Spinner />
            </div>
            <div v-else>
                <div class="rounded-lg">
                    <v-data-table
                        :headers="headers"
                        :items="userStore.usersNoRolDep"
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        :search="search"
                    >
                        <template v-slot:item.actions="{ item }">
                            <div class="flex flex-col gap-2 my-4">
                                
                                <button class=" flex gap-1 items-center text-green-500 hover:text-green-300"
                                    @click="acceptUserHandler(item)"
                                >
                                    <CheckCircleIcon class="w-5"/>
                                    <p>Aceptar</p>
                                </button>

                                <button class=" flex gap-1 items-center text-red-500 hover:text-red-300"
                                    @click="denyUserHandler(item)"
                                >
                                    <TrashIcon class="w-5"/>
                                    <p>Rechazar</p>
                                </button>
                            </div>
                        </template>
                    </v-data-table>
                </div>
             
            </div>
            
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/user';
import { CheckCircleIcon, TrashIcon } from "@heroicons/vue/24/solid";
import Spinner from '../Spinner.vue';
import SearchInput from '../SearchInput.vue';

const search = ref()
const userStore = useUserStore()
const { loading } = storeToRefs(userStore)
const rolUpdate = 3

const acceptUserHandler = (item) => {

    Swal.fire({
        title: 'Aisgnar rol de empleado',
        text: `Se le dara acceso a "${item.name} ${item.last_name}" con el rol de empleado en la aplicación`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            item.id_rol = rolUpdate //Agrega el id del rol
            userStore.updateRolHead(item)
        }
    })
}

const denyUserHandler = (item) => {
    Swal.fire({
        title: 'Denegar acceso a empleado',
        text: `Se le negera el acceso y se eliminara al usuario "${item.name} ${item.last_name}"`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if(result.isConfirmed) {
            userStore.deleteUserDep(item.id_user)
        }
    })
}

onMounted(() => {
    userStore.getUserDepartmentNoRol()
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


</script>

<style lang="scss" scoped>

</style>
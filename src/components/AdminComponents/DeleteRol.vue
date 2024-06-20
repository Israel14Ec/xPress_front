<template>
    <div v-if="userStore.loading">
        <Spinner/>
    </div>
    <div v-else>
        <div class="mt-5 max-w-[95%] mx-auto bg-white p-4 rounded-2xl">
            <h3 class="text-center text-gray-600 text-2xl font-bold mb-3 border-b-2 border-b-gray-400">
                Usuarios eliminados
            </h3>

            <div class="mt-5 rounded-xl">
                <v-data-table
                    :items="userStore.usersInvalid"
                    :headers="headers"
                    :items-per-page-options="itemsOption"
                    no-data-text="No hay datos disponibles" 
                    items-per-page-text="Mostrando"
                    >
                    <template v-slot:item.actions="{item}">
                        <button class="mb-2 flex flex-row items-center gap-1 text-blue-500 hover:text-blue-300"
                            @click="restoreUser(item)"
                            >
                            <ArrowUturnRightIcon class="w-5" />
                            <p>Restaurar</p>
                        </button>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import { itemsOption } from "../../helpers/utils";
import { ArrowUturnRightIcon } from "@heroicons/vue/24/solid";
import Spinner from "../Spinner.vue";
import Swal from "sweetalert2";

const userStore = useUserStore();

onMounted(() => {
    userStore.loadInvalidUser();
});


const headers = [
  { key: 'name', title: 'Nombre'},
  { key: 'last_name', title: 'Apellido'},
  { key: 'email', title: 'email'},
  { key: 'phone_number', title: 'Teléfono'},
  { 
    title: 'Departamento',  
    align: 'center',
    children: [
      { key: 'name_department', title: 'Nombre'},
      { key: 'name_rol', title: 'Rol'},
    ]
  },
  { key: 'actions', title: 'Acciones'}
]

const restoreUser = (item) => {

    Swal.fire({
        title: "Restaurar usuario",
        text: `El usuario ${item.name} ${item.last_name}, será restaurado en la aplicación, aparecer en la asignación de rol`,
        showDenyButton: true,
        confirmButtonText: "Aceptar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const userNew = {
                id_user: item.id_user,
                id_rol: 4,
            };
            userStore.restoreUser(userNew);
        }
    });
};
</script>

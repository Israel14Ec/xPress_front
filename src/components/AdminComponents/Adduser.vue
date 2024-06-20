x<template>
    <div class="mt-5 max-w-[95%] mx-auto bg-white p-4 rounded-2xl">
        <div v-if="userStore.loading">
            <Spinner />
        </div>

        <div v-else>
            <div class="mb-10">
                <h3 class="text-center text-gray-600 text-2xl font-bold mb-3 border-b-2 border-b-gray-400">
                    Asignar usuarios
                </h3>
                <p class="mt-5 text-gray-700">
                    En la tabla se presentan los usuarios que han solicitado acceso a la aplicación. 
                    Se les debe asignar el rol correspondiente, ya sea de Jefe de Departamento o Empleado.
                </p>
            </div>
            
            <div>
                <div class="flex flex-row justify-between items-end mx-auto mb-4 gap-5">
                    <div class="w-1/3">
                        <SearchInput  v-model:searchValue="search"/>
                    </div>
                    <div class="">
                        <button @click="dialog = true">
                            <ButtonBlack class="bg-blue-500/80 hover:bg-blue-300 text-white">
                                <PlusCircleIcon />
                                <template #text>
                                    Agregar administrador
                                </template>
                            </ButtonBlack>
                        </button>
                    </div>
                </div>
                <div class=" rounded-xl">
                    <v-data-table
                        :items="userStore.users"
                        :headers="headers"
                        :items-per-page-options="itemsOption"
                        :search="search" 
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
            
                        >

                        <template v-slot:item.phone_number="{ item }">
                            <p
                                :class="{ 'text-red-500': item.phone_number == '' }"
                            > {{ item.phone_number != '' ? item.phone_number : 'No se proporciono un número de teléfono'}}</p>
                        </template>

                        <template v-slot:item.actions="{ item }">

                            <div class="flex flex-col items-start my-4 gap-1">
                            
                                <div class="flex flex-row gap-1 items-center text-green-500 hover:text-green-300 cursor-pointer my-1"
                                    @click="openModalUserHandler(item)"
                                    >
                                    <PlusCircleIcon class="w-5"/>
                                    <p class="text-sm">Aceptar</p>
                                </div>

                                <div class="flex flex-row gap-1 justify-center items-center text-red-500 hover:text-red-500 cursor-pointer"
                                    @click="denyUserHandler(item)"
                                >
                                    <TrashIcon class="w-5"/>
                                    <p class="text-sm">Rechazar</p>
                                </div>
                            
                            </div>
            
                        </template>

                    </v-data-table>
                </div>
            

                <!--Modal para dar rol a un usuario-->
                <v-dialog max-width="600" v-model="dialogAdd">
 
                    <v-card prepend-icon="mdi-account-check" title="Agregar usuario">
                        <v-card-text>
                            <div class="mb-3">
                                <h3 class="text-lg mb-3 border-b-2">Datos del usuario</h3>
                                <p class=" font-semibold">Nombre: 
                                    <span class="font-normal">{{ `${dataUserAdd.name} ${dataUserAdd.last_name}` }}</span> 
                                </p>
                                <p class=" font-semibold">Correo electrónico: 
                                    <span class="font-normal">{{ `${dataUserAdd.email}` }}</span> 
                                </p>
                                <p class=" font-semibold">Número de teléfono: 
                                    <span class="font-normal">{{ `${dataUserAdd.phone_number}` }}</span> 
                                </p>
                                <p class=" font-semibold">Departamento: 
                                    <span class="font-normal">{{ `${dataUserAdd.name_department}` }}</span> 
                                </p>
                            </div>
                            <FormKit type="form" :actions="false" incomplete-message="Revise las advertencias" 
                                @submit="acceptUserHandler"
                                >
                               
                                <FormKit 
                                    type="select"
                                    label="Rol"
                                    name="id_rol"
                                    placeholder="Seleccione un rol"
                                    :options="selectOptions"     
                                    validation="required|customValidation"
                                    :validation-messages="{
                                        required: 'Debe seleccionar un rol',
                                        customValidation: 'Debe seleccionar un rol válido'
                                    }"
                                    v-model="selectRol"
                               />

                               <FormKit
                                    type="submit"
                                    :disabled="isDisabled"
                                >
                                    Agregar
                               </FormKit>
                               <p v-if="isDisabled" class="text-red-500 text-center font-semibold text-sm">
                                    Elija un rol
                                </p>
                            </FormKit>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                

            </div>
            
        </div>


        <!--MODAL PARA AGREGAR ADMINISTRADORES-->
        <v-dialog max-width="600" v-model="dialog">
            <v-card prepend-icon="mdi-account-check" title="Agregar a un nuevo administrador">
                <v-card-text>   
                    <FormKit type="form" :actions="false" incomplete-message="Revise las advertencias" @submit="addUserAdminHandler">
                        <div class="mb-5 border-b-2 border-gray-500">
                            <p class="text-xl font-semibold">Rol: <span class="font-normal">Administrador</span> </p>
                            <p class="text-xl font-semibold">Departamento: <span class="font-normal">Administración</span></p>
                        </div>
      
                        <div class="flex flex-col md:flex-row md:gap-x-5">

                            <div class="w-full md:w-1/2">
                                <FormKit type="text" label="Nombre" name="name" placeholder="Ingrese un nombre"
                                    validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\\s]+$/" :validation-messages="{
                                        required: 'El nombre es obligatorio',
                                        matches: 'Ingrese un nombre válido'
                                    }"/>
                                    
                            </div>

                            <div class="w-full md:w-1/2">
                                <FormKit type="text" label="Apellido " name="last_name" placeholder="Ingrese un apellido"
                                    validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/ " :validation-messages="{
                                        required: 'El apellido es obligatorio',
                                        matches: 'Ingrese un apellido válido'
                                    }" />
                            </div>

                        </div>

                        <FormKit type="tel" label="Número de teléfono" name="phone_number" placeholder="xxx-xxx-xxxx"
                            validation="matches:/^[0-9]{10}$/" :validation-messages="{
                                matches: 'Ingrese solo 10 digitos'
                            }" />

                        <FormKit type="text" label="Correo electrónico " name="email" placeholder="Ingrese su nombre"
                            validation="required|email" :validation-messages="{
                            required: 'El correo es obligatorio',
                            email: 'Ingrese un correo electrónico válido'
                            }"/>

                            
                        <div class="flex flex-col md:flex-row md:gap-x-5">
                            <div class="w-full lg:w-1/2">
                                <FormKit type="password" label="Ingrese una contraseña" name="password"
                                    validation="required|length:8" :validation-messages="{
                                        required: 'El contraseña es obligatorio',
                                        length: 'La contraseña debe contener al menos 8 caracteres'
                                    }" autocomplete="current-password" 
                                    suffix-icon="eyeClosed"
                                    suffix-icon-class="hover:text-blue-500"
                                    @suffix-icon-click="handleIconClick"
                                />
                            </div>

                            <div class="w-full lg:w-1/2">
                                <FormKit type="password" label="Confirme la contraseña" name="password_confirm"
                                    validation="required|confirm" :validation-messages="{
                                        required: 'Confirmar la contraseña es obligatorio',
                                        confirm: 'Las contraseñas no coinciden'
                                    }" autocomplete="current-password" 
                                    suffix-icon="eyeClosed"
                                    suffix-icon-class="hover:text-blue-500"
                                    @suffix-icon-click="handleIconClick"
                                />
                            </div>
                        </div>

                        <FormKit
                            type="submit"   
                        >
                            Agregar
                        </FormKit>

                    </FormKit>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import { useUserStore } from "../../stores/user";
import { itemsOption } from '../../helpers/utils'
import { TrashIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
import Swal from 'sweetalert2'
import Spinner from "../Spinner.vue";
import SearchInput from '../SearchInput.vue';
import ButtonBlack from '../ButtonBlack.vue';


//Modal
const dialog = ref(false)
const dialogAdd = ref(false)
const dataUserAdd = ref({})
const selectRol = ref(1)

//Administrador
const departmentAdmin = 1
const rolAdmin = 1

const search = ref('')

onMounted(() => {
    userStore.loadUserNoRol()
})

const userStore = useUserStore();


const headers = [
    { key: 'name', title: 'Nombre'},
    { key: 'last_name', title: 'Apellido'},
    { key: 'name_department', title: 'Departamento'},
    { key: 'email', title: 'Correo'},
    { key: 'phone_number', title: 'Teléfono'},
    { key: 'actions', title: 'Acciones'}
]

//Opciones del Select
const selectOptions = [
    { value: 1, label: 'Seleccione un rol ---',  attrs: { disabled: true }},
    { value: 2, label: 'Jefe de departamento' },
    { value: 3, label: 'Empleado' },
]

const acceptUserHandler = () => {

    dataUserAdd.value.id_rol = selectRol.value //Cambia con lo que esta en el selectRol
    userStore.updateUserRol(dataUserAdd.value)
    dialogAdd.value = false
    dataUserAdd.value = {}
}

watch(dialogAdd, () => {
    if(dialogAdd.value === false) {
        selectRol.value = 1
    }
})

// Computed para deshabilitar el botón de envío
const isDisabled = computed(() => {
  return selectRol.value === 1 || selectRol.value === null;
});

//abre el modal con los datos del usuario
const openModalUserHandler = (item) => {
    dialogAdd.value = true
    dataUserAdd.value = item
}


//Niega a los usuarios
const denyUserHandler = (item) => {
    Swal.fire({
        title: 'Confirmacion',
        text: `Al usuario ${item.name} ${item.last_name}, se le negara el acceso`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            userStore.deleteUser(item.id_user)
        }
    });
}

//Permite visualizar el password
const handleIconClick = (node, e) => {
    node.props.prefixIcon = node.props.prefixIcon === 'eye' ? 'eyeClosed' : 'eye'
    node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

//Agregar un usuario administrador
const addUserAdminHandler = ({password_confirm, ...formData}) => {
    
    //agregamos las variables que faltan
    formData.id_department = departmentAdmin
    formData.id_rol = rolAdmin
    userStore.addUserAdmin(formData)

    setTimeout(() => {
       dialog.value = false
    }, 1000);
   
}


</script>


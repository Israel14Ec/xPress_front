<template>
  <div class="mt-5 max-w-[95%] mx-auto bg-white p-4 rounded-2xl">

    <div v-if="userStore.loading">
      <Spinner />
    </div>
    <div v-else>
      <p class="text-center text-gray-600 text-2xl font-bold mb-3 border-b-2 border-b-gray-400">
        Editar Roles
      </p>

      <div class="flex flex-col md:flex-row justify-between items-center gap-10 mt-10">
        <div class="w-1/3">
          <SearchInput  v-model:searchValue="search"/>
        </div>
        <div class="flex flex-row gap-5">
          <div >
            <p class="text-sm text-gray-800 font-semibold">Buscar por departamento</p>
            <select class="border border-gray-700 rounded-md p-1 text-gray-500 mt-2 w-52" v-model="optionSelect.id_department"
              @change="selectHandler">
              <option value="0">Todos</option>
              <option v-for="option in departmentStore.departments" :key="option.id_department"
                :value="option.id_department">
                {{ option.name_department }}
              </option>
            </select>
          </div>

           <div>
          <p class="text-sm text-gray-800 font-semibold">Buscar por rol</p>
            <select class="border rounded-md p-1 text-gray-700 my-3 w-52" v-model="optionSelect.id_rol"
              @change="selectHandler">
              <option value="0">
                Todos
              </option>
              <option v-for="option in selectOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-5 rounded-xl">
        <v-data-table
          :items="userStore.usersRol"
          :headers="headers"
          :search="search" 
          :items-per-page-options="itemsOption"
          no-data-text="No hay datos disponibles" 
          items-per-page-text="Mostrando"
          > 
          
          <template v-slot:item.phone_number="{ item }">
            <p
              :class="{ 'text-red-500': item.phone_number == '' }"
              > {{ item.phone_number != '' ? item.phone_number : 'No se proporciono un número de teléfono'}}
            </p>
          </template>

          <template v-slot:item.actions="{item}">
            <div class="my-4">
              <button class="mb-2 flex flex-row items-center gap-1 text-green-500 hover:text-green-300"  
                @click="openModalEditHandler(item)"
                >
                <PencilIcon class="w-5" />
                <p>Editar</p>
              </button>
              
              <button class="flex flex-row items-center gap-1 text-red-500 hover:text-red-300" @click="deleteHandler(item)">
                <TrashIcon class="w-5"/>
                <p>Eliminar</p>
              </button>
              
            </div>
          </template>

        </v-data-table>

        <!--DIALOGO PARA EDITAR EL ROL DE USUARIO-->
        <v-dialog max-width="600" v-model="dialog">
          <v-card prepend-icon="mdi-account-edit" title="Editar rol de usuario">
            <v-card-text>
              <div class="mb-3">
                <h3 class="text-lg mb-3 border-b-2">Datos del usuario</h3>
                <p class=" font-semibold">Nombre: 
                  <span class="font-normal">{{ `${dataUserEdit.name} ${dataUserEdit.last_name}` }}</span> 
                </p>
                <p class=" font-semibold">Correo electrónico: 
                  <span class="font-normal">{{ `${dataUserEdit.email}` }}</span> 
                </p>
                <p class=" font-semibold">Número de teléfono: 
                  <span class="font-normal">{{ `${dataUserEdit.phone_number}` }}</span> 
                </p>
                <p class=" font-semibold">Departamento: 
                  <span class="font-normal">{{ `${dataUserEdit.name_department}` }}</span> 
                </p>
                <p class=" font-semibold text-red-500">Rol actual: 
                  <span class="font-normal">{{ `${dataUserEdit.name_rol}` }}</span> 
                </p>
              </div>
  
              <FormKit type="form" :actions="false" incomplete-message="Revise las advertencias" 
                @submit="editHandler"
              >
                               
                <FormKit 
                  type="select"
                  label="Nuevo rol"
                  name="id_rol"
                  placeholder="Seleccione un nuevo rol"
                  :options="selectOptions"     
                  validation="required"
                  :value="dataUserEdit.id_rol"
                  :validation-messages="{
                    required: 'Debe seleccionar un rol',
                  }"

                />

                  <FormKit
                    type="submit"
                  >
                    Guardar
                  </FormKit>

              </FormKit>
            </v-card-text>
          </v-card> 
        </v-dialog>

      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from "../../stores/user";
import { itemsOption } from '../../helpers/utils'
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { useDepartmentStore } from '../../stores/department'
import Swal from 'sweetalert2'
import Spinner from "../Spinner.vue";
import SearchInput from '../SearchInput.vue';


const userStore = useUserStore();
const departmentStore = useDepartmentStore()
const search = ref('')

//Modal
const dialog = ref(false)
const dataUserEdit = ref({})

const optionSelect = reactive({
  id_department: 0,
  id_rol: 0
})


onMounted(() => {
  userStore.loadUserRol()
})

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

//Opciones del Select
const selectOptions = [
  { value: 2, label: 'Jefe de departamento' },
  { value: 3, label: 'Empleado' },
]

//Buscar segun departamento y rol
const selectHandler = () => {
  userStore.allUser(optionSelect.id_department, optionSelect.id_rol)
}


//Abrir el modal y llenar los datos
const openModalEditHandler = (item) => {
  dialog.value = true
  dataUserEdit.value = item

}

//Al hacer click en Editar
const editHandler = ({id_rol}) => {
  dataUserEdit.value.id_rol = id_rol
  userStore.updateUserRol(dataUserEdit.value)
  dialog.value = false
}


const deleteHandler = (item) => {

  Swal.fire({
    title: "Eliminar usuario",
    text: `Al usuario ${item.name} ${item.last_name}, se le eliminara de la aplicacion`,
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      userStore.deleteLogicUser(item.id_user)
    }
  })
}

</script>

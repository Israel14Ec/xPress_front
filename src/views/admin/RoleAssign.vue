<template>
  <div class="flex mt-10 lg:flex-row flex-col items-center justify-center gap-6">

    <CardOptions 
      class="border-b-2 border-blue-500 hover:bg-blue-100 text-gray-700 w-72"
      :class="[option === 1 ? 'bg-blue-100' : 'bg-white']"
      @click="optionSelect(1)"
    >
      <PlusCircleIcon />
      <template #text>Asignar rol</template>
      <template #description>Agregue a los usuarios que quieren unirse a la aplicación.</template>
    </CardOptions>

    <CardOptions 
      class="border-b-2 border-gray-500 hover:bg-gray-200 text-gray-700 w-72"
      :class="[option === 2 ? 'bg-gray-200' : 'bg-white']"
      @click="optionSelect(2)"
    >
      <PencilSquareIcon />
      <template #text>Gestionar roles</template>
      <template #description>Modifica el rol y elimina usuarios de la aplicación</template>
    </CardOptions>

    <CardOptions 
      class="border-b-2 border-red-500 hover:bg-red-100 text-gray-700 w-72"
      :class="[option === 3 ? 'bg-red-100' : 'bg-white']"
      @click="optionSelect(3)"
    >
      <TrashIcon />
      <template #text>Usuarios eliminados</template>
      <template #description>Visualiza y restaura a los usuarios que han sido eliminados.</template>
    </CardOptions>
  </div>

  <div v-if="option == 1">
    <AddUser/>
  </div>
  
  <div v-if="option == 2">
    <EditRol/>
  </div>

  <div v-if="option == 3">
    <DeleteRol/>
  </div>
  

</template>

<script setup>
import { ref} from "vue";
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/solid";
import CardOptions from "../../components/CardOptions.vue";
import AddUser from "../../components/AdminComponents/Adduser.vue";
import DeleteRol from "../../components/AdminComponents/DeleteRol.vue";
import EditRol from "../../components/AdminComponents/EditRol.vue";


const option = ref(1)

const optionSelect = (select)=> {
  option.value = select
}

</script>


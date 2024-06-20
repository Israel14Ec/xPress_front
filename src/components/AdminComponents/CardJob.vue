<template>
    <div class="bg-gray-50 shadow rounded-lg px-5">
    
        <div class="flex flex-col lg:flex-row justify-between items-start mx-auto gap-5 relative">
            <p class="text-black font-bold text-lg"> {{ objectJob.name_job }}</p>   
            <EllipsisHorizontalIcon
                ref="ellipsis"
                @click="selectHandler"
                class="w-5 cursor-pointer hover:text-blue-500"
            />
            <div v-if="selectOption" class="absolute right-0 mt-5 py-2 w-48 bg-gray-700 rounded-md shadow-xl z-10">
   
                
                <RouterLink
                    :to="{name: 'JobEdit', params: { id: objectJob.id_job }}"
                >   

                    <div class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-500">
                        Editar
                    </div>
                        
                </RouterLink>
  
                <button 
                    class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-500"
                    @click="deleteHandler(objectJob)"
                >
                    Eliminar
                </button>

                <RouterLink v-if="step == 1" :to="{name: 'DepartmentAssing', params: {id: objectJob.id_job}}">
                    <button 
                        class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-500"
                    >
                        Asignar departamento
                    </button>
                </RouterLink>
                
                <div  v-if="step == 5" class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-500">
                    <RouterLink
                    :to="{ name: 'JobFinishDetailsAdmin', params: { id: objectJob.id_job }}" 
                    >
                        Detalles
                    </RouterLink>
                </div>
        
            </div>
        </div>
        
        <p class="text-xs text-red-500 font-semibold">Prioridad: <span class="text-gray-700 font-normal"> {{ objectJob.name_priority}}</span> </p>
        <p class="text-gray-700 text-sm mt-5"> {{ objectJob.description }}</p>
        <div class="mt-5 flex flex-row gap-3">

            <div class="w-1/2 h-28">
                <img 
                    v-if="objectJob.before_picture"
                    :src="objectJob.before_picture" 
                    alt="Imagen del trabajo" 
                    class="h-full w-full object-cover rounded-md" 
                >
                <div v-else class="h-full w-full flex justify-center items-center">
                    <img src="/trabajo.png" alt="Imagen predeterminada del trabajo" class="h-full w-full object-cover rounded-md">
                </div>
            </div>


            <div class="h-5 space-y-1">
                
                <p class="text-xs text-black font-semibold">Local: <span class="text-gray-600 font-normal"> {{ objectJob.name_establishment }}</span> </p>
                <p class="text-xs text-black font-semibold">Mantenimiento <span class="text-gray-600 font-normal">{{ objectJob.name_maintenance }}</span> </p>
                <p class="text-xs text-black font-semibold">Cliente <span class="text-gray-600 font-normal">{{  objectJob.name_client  }}</span> </p>
            </div>
        </div>
        

    </div>

</template>


<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'

const selectOption = ref(false)
const ellipsis = ref(null);
const emit = defineEmits(['job-deleted']);

const props = defineProps({
    objectJob: Object,
    step: Number
});

//Despliega el modal
const selectHandler = () => {
    selectOption.value = !selectOption.value
}

const deleteHandler = (job) => {
    emit('job-deleted', job); //se envia al componente padre
    selectOption.value = false
}

//Cierra el modal si hace click en otra parte del código
const closeMenu = (e) => {
  if (ellipsis.value && !ellipsis.value.contains(e.target) && selectOption.value) {
    selectOption.value = false;
  }
};

//Agrega el manejador de eventos
onMounted(() => {
  document.addEventListener('click', closeMenu);
});

//Elimina el manejador de eventos
onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});



</script>

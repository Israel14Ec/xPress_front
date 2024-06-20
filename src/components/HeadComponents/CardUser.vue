<template>
    <div class="bg-gray-600 px-5 py-2 hover:bg-gray-500 cursor-pointer mb-5 rounded-md"
        @click="assignStore.selectUsers(user)"
    >
        <div class="flex flex-row gap-5">

            <div class="flex flex-row gap-5 items-center">
                <!--Imagen de Perfil-->
                <div class="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden ring-2 ring-gray-50">
                    <div v-if="user.image">
                        <img :src="user.image" alt="imagen de perfil del usuario" 
                            class="h-12 w-12 object-cover rounded-full">
                    </div>
                    <div v-else class="h-12 w-12 bg-gray-50 rounded-full flex justify-center items-center">
                        <p class="text-gray-700 font-semibold uppercase">{{ user.name.charAt(0) + user.last_name.charAt(0)}}</p>
                    </div>
                </div>

                <!--Resto de información-->
                <div>
                    <p class="font-bold text-yellow-400">{{user.name + " " + user.last_name }}</p>
                        <div class="flex flex-row items-end gap-2 text-sm">
                            <p class="text-white font-semibold">Teléfono: </p>
                            <p class="text-white"> {{ user.phone_number }}</p>
                        </div>
                        
                        <div class="flex flex-row items-end gap-2 text-sm">
                            <p class="text-white font-semibold">Correo: </p>
                        <p class="text-white"> {{ user.email }}</p>  
                        </div>
                                      
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import { useAssignedWorkerStore } from '../../stores/assignedWorker';

const assignStore = useAssignedWorkerStore()
const props = defineProps({
    user: Object
})
</script>


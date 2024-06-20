<template>
    <div class="flex flex-col">
        <div class="mb-2 mx-3">
            
            <div class="mt-1 py-1 rounded-lg flex flex-row text-gray-50 hover:bg-gray-500 bg-clip-border cursor-pointer"
                @click="user.logOut"
            >
                <div class="ml-6 w-5">
                    <ArrowLeftOnRectangleIcon/>
                </div>
                <p class="ml-3 font-semibold text-sm">
                    Cerrar Sesión 
                </p>
            </div>
          
        </div>
    </div>
    <div class="border-t-2 border-gray-300">
        <div class="mt-2 ml-3">

            <div class="flex flex-row items-center">

                <div class="flex-shrink-0 h-14 w-14 rounded-full overflow-hidden ring-2 ring-gray-50" v-if="user.userData.name && user.userData.last_name">    
                    <div v-if="user.userData.image">
                        <img :src="user.userData.image" alt="imagen de perfil" class="h-14 w-14 object-cover rounded-full">
                    </div>
                    <div v-else class="h-14 w-14 bg-gray-50 rounded-full flex justify-center items-center">
                        <p class="text-gray-700 font-semibold">{{ user.userData.name.charAt(0) + user.userData.last_name.charAt(0)}}</p>
                    </div>
                </div>

                <div class="flex-grow pl-4">
                    <p class="font-semibold text-gray-50 text-lg mb-1">
                        {{ currentRol }}
                    </p>
                    <p class="font-semibold text-yellow-500">
                        {{ user.userData.name + " " + user.userData.last_name }}
                    </p>
    
                    <RouterLink
                        :to = "{name: nameRoute}"
                    >
                        <p class="text-gray-200 text-sm hover:text-blue-500">
                            Editar Perfil
                        </p>
                    </RouterLink>
                    
                </div>
            </div>
                
        </div>
    </div>
    
</template>

<script setup>

    import {ref, onMounted} from 'vue'
    import { RouterLink } from 'vue-router'
    import {useAuthStore} from '../stores/auth'
    import { useRolStore } from '../stores/rol';
    import { ArrowLeftOnRectangleIcon  } from '@heroicons/vue/24/solid'

    const currentRol = ref()
    const user = useAuthStore()
    const rolStore = useRolStore()

    const getRol = async () => {
        const {name_rol} = await rolStore.getRolById(user.userData.id_rol)
        currentRol.value = name_rol
    }

    onMounted(() => {
        getRol()
    })
    
    defineProps({
        nameRoute: {
            type: String
        }
    })
    
</script>


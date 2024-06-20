<template>
    <div class="border-b-2 mb-5">
        <div class="cursor-pointer bg-gray-100/40 rounded-xl mb-1 shadow-md">
            <div class="mt-5 rounded-lg p-2 text-gray-600 font-semibold">
                <p :class="[notify.priority != null ? 'text-red-500' :'text-sm font-bold text-yellow-500']">
                    {{ notify.subject }}
                </p>

                <p v-if="notify.from" class="text-sm text-gray-700 mb-2">De: 
                    <span class="font-normal">{{ notify.from }}</span> 
                </p>

                <p>Titulo: <span class="font-normal">{{ notify.title }}</span></p>
                <div>
                    <p>Descripción</p>
                    <p class="font-normal"> {{ notify.description }} </p>
                </div>
                
                <div>
                    <p class="mt-3">Fecha:</p>
                    <span class="font-normal">{{ notify.date }}</span>
                </div>            
            </div>
            
            <div v-if="isDelete" class="flex flex-row gap-1 text-sm justify-center items-center hover:text-gray-500"
                @click="notification.deleteNotify(notify.id)"
            >
                <TrashIcon class="w-5"/>
                <p>Eliminar</p>
            </div>

            <div v-else class="flex flex-row gap-1 text-sm justify-center items-center hover:text-gray-500"
                @click="notification.markAsRead(notify)">
                <EyeIcon class="w-5"/>
                <p>Marcar como leido</p>
            </div>


        </div>
    </div>
</template>

<script setup>

import { useNotificationStore } from '../stores/notification'
import { EyeIcon, TrashIcon } from '@heroicons/vue/24/solid'
const notification = useNotificationStore()

const props = defineProps({
    notify: {
        type: Object
    },
    isDelete: {
        type: Boolean
    }
})

</script>


<template>
    <div class="m-2 bg-gray-50 shadow rounded-lg p-1 relative">
        <div class="absolute top-0 right-0 p-1">
            <XCircleIcon class="w-5 text-red-500 hover:text-red-300 cursor-pointer"
                @click="deleteHandler(imageUrl, idWorkOrder)"    
            />
        </div>
        <img :src="imageUrl" alt="Imagen" class="w-40 h-40 object-contain">
    </div>
</template>

<script setup>
import {XCircleIcon} from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'
import { useWorkOrderStore } from '../../stores/workOrders'

const workStore = useWorkOrderStore()

defineProps({
    imageUrl: {
        type: String
    },
    idWorkOrder: {
        type: String
    }
})

//Elimina la foto
const deleteHandler = (url, id_work_order) => {
    Swal.fire({
        title: 'Eliminar la foto',
        html: `
            <p>Va a eliminar la foto seleccionada</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if(result.isConfirmed) {
            workStore.deleteImageWorkOrder(url, id_work_order)
        }
    })
}


</script>


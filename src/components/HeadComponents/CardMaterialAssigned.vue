<template>
    <div class="flex justify-between items-center bg-gray-100 rounded-lg px-5 py-1 mb-5">
        <div>
            <p class="text-gray-600 font-semibold"> {{ material.name_material }}</p>
            <div class="text-sm">
                <p>Stock disponible: {{ material.stock }}</p>
                <p>Cantidad solicitada: {{ material.pivot.amount }}</p>
            </div>
            <div class=" mt-2 text-sm "> 
                <p v-if="material.pivot.is_delivered === false"  class="text-sm text-gray-500">
                    Se puede eliminar o editar el pedido de material
                </p>
                <p v-else class=" text-red-500">Se debe solicitar más material</p>
            </div>
            
        </div>
        <div v-if="material.pivot.is_delivered === false" class="flex flex-row gap-2 hover:cursor-pointer px-5">
            <PencilIcon class="w-5 text-gray-700 hover:text-gray-500"
                @click="editHandler(material)"
            />
            <TrashIcon 
                class="w-5 text-gray-700 hover:text-gray-500"
                @click="deleteHandler(material)"
            />
        </div>
    </div>

</template>

<script setup>

import { useEditWorkOrderStore } from '../../stores/EditWorkOrder';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'

const editOrderStore = useEditWorkOrderStore()

const deleteHandler = (item) => {
    Swal.fire({
        title: 'Eliminar pedido del material',
        html: `Esta seguro de eliminar el pedido del material: <b>${item.name_material}</b>?`,
        icon: 'info',
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then((result) => {
        if(result.isConfirmed) {
           editOrderStore.deletedAssignedMaterial(item.pivot.id_material_assigned)
        }
    })
}

const editHandler = (item) => {

    Swal.fire({
        title: 'Editar cantidad solicitada',
        html: `
            <div class="flex flex-col items-start">
                <p class="text-gray-600 text-left font-semibold"> 
                    Material seleccionado: <span class="font-normal">${item.name_material} </span>
                </p>
                
                <label class="text-gray-600 mt-6 mb-1" for="stock_quantity">Cantidad solicitada: </label>
                  <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                      type="number" 
                      id="stock_quantity"
                      min="1"
                      max="${item.stock}"
                      value="${item.pivot.amount}"
                  />
                <p class="text-gray-500 text-sm">Hay disponibilidad de <span class="text-red-500"> ${item.stock} </span></p>
            </div>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        preConfirm: () => {
            const stockInput = document.getElementById('stock_quantity').value;
            const stockValue = parseInt(stockInput);
            if (stockValue > item.stock) {
                Swal.showValidationMessage(`Supero al stock disponible (${item.stock})`);
                return false;
            }

            if (stockValue <= 0 || !stockValue) {
                Swal.showValidationMessage(`No se ingreso un valor valido`);
                return false;
            }

            const dataUpdate = {
                id_material_assigned: item.pivot.id_material_assigned,
                amount: stockValue
                
            }
            return {
               dataUpdate
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            editOrderStore.assignedMaterialEdit(result.value.dataUpdate)
        }
    })
}


const props = defineProps({
    material: {
        type: Object
    }
})
</script>

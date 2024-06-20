<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto px-4">
            <div class="w-full md:w-1/2">
                <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined"  density="compact" 
                    placeholder="Nombre del tipo de mantenimiento" hide-details label="Buscar" 
                />

            </div>
            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto">
                <button @click="addHandler">
                    <ButtonBlack class="bg-gray-700 text-white hover:bg-gray-500">
                        <PlusCircleIcon/>
                        <template #text>Añadir</template>
                    </ButtonBlack>
                </button>
            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <div v-if="maintenanceStore.load">
                <Spinner/>
            </div>
            <div v-else>
                <div class="rounded-2xl">
                    <v-data-table
                        :headers="headers"
                        :items="maintenanceStore.maintenances"
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        :search="search"
                        v-bind="dataTableConfig"
                    >  
                        <template v-slot:item.actions="{ item }">
                            <div class="flex flex-col gap-2 my-2">
                                <button class="cursor-pointer text-green-500 hover:text-green-300 flex gap-1"  @click="editHandler(item)">
                                    <PencilIcon
                                        class="w-5 "
                                    />
                                    <p>Editar</p>
                                </button>
                                
                                <button class="cursor-pointer text-red-500 hover:text-red-400 flex gap-1" 
                                    @click="deleteHandler(item)">
                                    <TrashIcon
                                        class="w-5 "
                                        
                                    />
                                    <p>Eliminar</p>
                                </button>
                    
                            </div>
                        </template>
                    </v-data-table>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { useMaintenanceStore } from '../../../stores/maintenance'
import { itemsOption, dataTableConfig } from '../../../helpers/utils'
import Swal from 'sweetalert2'
import SearchInput from '../../../components/SearchInput.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import Spinner from '../../../components/Spinner.vue';

const search = ref()
const maintenanceStore = useMaintenanceStore()

const headers = [
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'actions', title: 'Acciones'}
];


const addHandler = () => {
    Swal.fire({
        title: 'Agregar tipo de mantenimiento',
        html: `
            <form class="flex flex-col items-start"> 
                
                <div class="flex w-full">
                    <label for="name" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                    <input 
                    id="name" 
                    type="text" 
                    class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    />
                </div>
                
                <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                ></textarea>
                <div id="descriptionCounter" class="text-sm text-gray-600">0/300</div>  
            </form>
        `,
        showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
        },    
        didOpen: () => {
            const descriptionTextarea = document.getElementById('description');
            const descriptionCounter = document.getElementById('descriptionCounter');
            const maxChars = 300; // Límite de caracteres

            descriptionTextarea.addEventListener('input', () => {
                let textLength = descriptionTextarea.value.length;
                if (textLength > maxChars) { 
                    descriptionTextarea.value = descriptionTextarea.value.substring(0, maxChars);
                    textLength = maxChars; 
                }
                descriptionCounter.textContent = `${textLength}/${maxChars}`;
            });
        },
        preConfirm: () => {
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!name || !description) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
            return { name, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
                maintenanceStore.create(result.value)
        }
    });
}

const editHandler = (item) => {
    Swal.fire({
        title: 'Agregar tipo de mantenimiento',
        html: `
            <form class="flex flex-col items-start"> 
                
                <div class="flex w-full">
                    <label for="name" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                    <input 
                    id="name" 
                    type="text" 
                    value="${item.name}"
                    class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    />
                </div>
                
                <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                >${item.description}</textarea>
                <div id="descriptionCounter" class="text-sm text-gray-600">0/300</div>  
            </form>
        `,
        showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
        },    
        didOpen: () => {
            const descriptionTextarea = document.getElementById('description');
            const descriptionCounter = document.getElementById('descriptionCounter');
            const maxChars = 300; // Límite de caracteres

            // Establece el contador con la longitud actual de la descripción
            descriptionCounter.textContent = `${descriptionTextarea.value.length}/${maxChars}`;

            descriptionTextarea.addEventListener('input', () => {
                let textLength = descriptionTextarea.value.length;
                if (textLength > maxChars) { 
                    descriptionTextarea.value = descriptionTextarea.value.substring(0, maxChars);
                    textLength = maxChars; 
                }
                descriptionCounter.textContent = `${textLength}/${maxChars}`;
            });
        },

        preConfirm: () => {
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!name || !description) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
            return {id_type_maintenance: item.id_type_maintenance ,name, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
                maintenanceStore.update(result.value)
        }
    });
}

const deleteHandler = async (item) => {
    const result = await Swal.fire({
        title: 'Eliminar estado',
        text: ` Se eliminara el estado "${item.name}", en algunos casos la eliminación no es posible`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        maintenanceStore.deleteMaintenance(item)
    }
}

</script>

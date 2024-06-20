<template>
    <div class="max-w-[97%] mt-10 mx-auto">

        <div class="px-4 mt-4">
            <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined"  density="compact" 
                placeholder="Nombre del estado" hide-details label="Buscar" 
            />
        </div>
        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <div class="rounded-2xl">
                <div v-if="statusStore.load">
                    <Spinner/>
                </div>

                <div v-else>
                    <div class="rounded-2xl">
                        <v-data-table
                            :headers="headers"
                            :items="statusStore.status"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >  
                            <template v-slot:item.color="{ item }">
                                <div :style="{ backgroundColor: item.color }" class="w-6 h-6 rounded-full border border-gray-200"></div>
                            </template>

                            <template v-slot:item.step="{ item }">
                                <p>{{ item.step ? 'Paso ' + item.step : 'No pertenece a la secuencia' }}</p>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <button class="flex flex-row gap-1 text-green-500 hover:text-green-400"  
                                    @click="editHandler(item)">
                                    <PencilIcon
                                        class="w-5"
                                    />
                                    <p>Editar</p>
                                </button>
                            </template>
                        </v-data-table>
                    </div>
               
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { useStatusJobStore } from '../../../stores/statusJob';
import SearchInput from '../../../components/SearchInput.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Spinner from '../../../components/Spinner.vue';
import Swal from 'sweetalert2'

const statusStore = useStatusJobStore()
const search = ref()

const headers = [
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'color', title: 'Color' },
    { key: 'step', title: 'Secuencia de pasos'},
    { key: 'actions', title: 'Acciones'}
];


const itemsOption = [
    5, 10, 15, -1
]

const addHandler = () => {
    Swal.fire({
        title: 'Agregar estado',
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
            
            <div class="w-full flex flex-row gap-5">
                <div class="w-1/2">
                    <label for="color" class="text-blue-500 mb-1">Color: </label>  
                    <input 
                        id="color" 
                        name="color"
                        type="color" 
                        class="ml-4 w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                        value="#73D673"
                    />
                </div>

                <div class="w-1/2">
                    <label for="stepSequence" class="text-blue-500 mt-4 mb-1">Secuencia de paso:</label>
                    <select id="stepSequence" class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white">
                        <option value="0">Seleccione</option>    
                    </select>
                </div>
            </div>
        </form>

        <p class="mt-6 bg-gray-400 py-2 text-sm text-white rounded-lg">
            Seleccione un valor para la secuencia de pasos si es necesario
        </p>
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

            //Llena el select
            const stepSequenceSelect = document.getElementById('stepSequence');
            for (let i = 1; i <= 10; i++) {
                let option = new Option(i, i);
                stepSequenceSelect.add(option);
            }
        },

        preConfirm: () => {
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const color = document.getElementById('color').value;
            const step = document.getElementById('stepSequence').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!name || !description) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
            }

            if(step == 0) {
                return {name, description, color}
            }

            return { name, description, color, step };
        }
    }).then((result) => {
        if (result.isConfirmed) {
                statusStore.create(result.value)
            }
    });
}


const editHandler = (item) => {
    Swal.fire({
        title: 'Agregar estado',
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
        
            
            <div class="w-full flex flex-row gap-5">
                <div class="w-1/2">
                    <label for="color" class="text-blue-500 mb-1">Color: </label>  
                    <input 
                        id="color" 
                        name="color"
                        type="color" 
                        class="ml-4 w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                        value="#73D673"
                    />
                </div>

                <div class="w-1/2">
                    <label for="stepSequence" class="text-blue-500 mt-4 mb-1">Secuencia de paso:</label>
                    <select id="stepSequence" class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white">
                        <option value="0">Sin valor</option>    
                    </select>
                </div>
            </div>
        </form>

        <p class="mt-6 bg-gray-400 py-2 text-sm text-white rounded-lg">
            Seleccione un valor para la secuencia de pasos si es necesario
        </p>
        
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

            const stepSequenceSelect = document.getElementById('stepSequence');
            for (let i = 1; i <= 10; i++) {
                let option = new Option(i, i);
                stepSequenceSelect.add(option);
            }

            // Establecer el valor actual si existe
            if (item && item.step) {
                stepSequenceSelect.value = item.step;
            }
        },
        preConfirm: () => {
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const color = document.getElementById('color').value;
            let step = document.getElementById('stepSequence').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!name || !description) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
            }
            
            if(step == 0) {
                step = ''
            }

            return {id_job_status: item.id_job_status, name, description, color, step };
        }
    }).then((result) => {

        if (result.isConfirmed) {
                statusStore.update(result.value)
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
        statusStore.deleteStatus(item)
    }
}

</script>

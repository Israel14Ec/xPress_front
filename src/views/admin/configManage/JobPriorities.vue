<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class=" px-4 mt-4">
            <div class="w-full md:w-auto">
                <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined"  density="compact" 
                    placeholder="Nombre de la prioridad" hide-details label="Buscar" 
                />

            </div>
 
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm"> 
            <div class="rounded-2xl">
                <div v-if="prioritiesStore.load">
                    <Spinner/>
                </div>
                <div v-else>
                    <div class="rounded-2xl">
                        <v-data-table
                            :headers="headers"
                            :items="prioritiesStore.priorities"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >

                            <template v-slot:item.actions="{ item }">
                                <div class="flex flex-col gap-2 my-2">
                                    <button @click="editHandler(item)" 
                                        class="cursor-pointer text-green-500 hover:text-green-400 flex gap-2"    
                                    >
                                        <PencilIcon class="w-5 "/>
                                        <p>Editar</p>
                                    </button>
                                    
                                    <button  @click="deleteHandler(item)"
                                        class="cursor-pointer text-red-500 hover:text-red-400 flex gap-2"
                                    >
                                        <TrashIcon class="w-5 "/>
                                        <p>Eliminar</p>
                                    </button>
                          
                                </div>
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
import SearchInput from '../../../components/SearchInput.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import { useJobPrioritiesStore } from '../../../stores/jobPriorities'
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'
import Spinner from '../../../components/Spinner.vue';

const search = ref()
const prioritiesStore = useJobPrioritiesStore()

const headers = [
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'level', title: 'Prioridad' },
    { key: 'actions', title: 'Acciones'}
];

const itemsOption = [
    5, 10, 15, -1
]

const addHandler = () => {
    Swal.fire({
        title: 'Agregar Prioridad',
        html: `
            <form id="myForm" class="flex flex-col items-start">
                <div class="flex flex-row items-start w-full gap-3">
                    <div class="w-1/2">
                        <label class="text-left text-blue-500 mt-4 mb-1" for="name">Nombre: </label>
                        <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                            type="text" 
                            id="name"
                            placeholder="nombre ..."
                        />
                    </div>    
                    <div class="w-1/2">
                        <label class="text-blue-500 mt-4 mb-1" for="level">Prioridad:</label>
                        <select
                            id="level"
                            class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white"
                        >
                            <option value="">Seleccione</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>  
                </div>
                <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                ></textarea>
                <div id="descriptionCounter" class="text-sm text-gray-600">0/300</div>    
            </form>
            <p class="mt-6 bg-gray-400 py-2 text-sm text-white rounded-lg">
                Solo se pueden poner prioridades del 1 al 5 sin repetirse
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
        },
        preConfirm: () => {
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const level = document.getElementById('level').value;

            if(!name || !description || !level) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
                
            return { name, description, level };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            prioritiesStore.create(result.value)
        }
    });
}


const editHandler = (item) => {

    const options = [1, 2, 3, 4, 5];

    Swal.fire({
        title: 'Editar Prioridad',
        html: `
            <form id="myForm" class="flex flex-col items-start">
                <div class="flex flex-row items-start w-full gap-3">
                    <div class="w-1/2">
                        <label class="text-left text-blue-500 mt-4 mb-1" for="name">Nombre: </label>
                        <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                            type="text" 
                            id="name"
                            value="${item.name}"
                        />
                    </div>    
                    <div class="w-1/2">
                        <label class="text-blue-500 mt-4 mb-1" for="level">Prioridad:</label>
                        <select
                            id="level"
                            class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white"
                        >
                            <option value="${item.level}">${item.level} (Actual)</option>
                            ${options.filter(opt => opt !== item.level).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>  
                </div>
                <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                >${item.description}</textarea>
                <div id="descriptionCounter" class="text-sm text-gray-600">0/300</div>    
            </form>
            <p class="mt-6 bg-gray-400 py-2 text-sm text-white rounded-lg">
                Solo se pueden poner prioridades del 1 al 3 sin repetirse
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
            const level = document.getElementById('level').value;

            if(!name || !description || !level) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
                
            return {id_job_priority: item.id_job_priority, name, description, level };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            prioritiesStore.update(result.value)
        }
    });
}

const deleteHandler = async (item) => {
    
    const result = await Swal.fire({
        title: 'Eliminar prioridad',
        text: ` Se eliminara la prioridad "${item.name}", en algunos casos no es posible borrar`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        prioritiesStore.deletPriority(item)
    }
}

</script>
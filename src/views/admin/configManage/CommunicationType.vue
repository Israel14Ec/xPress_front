<template>

    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto px-4">
            <div class="w-full md:w-1/2">
                <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined"  density="compact" 
                    placeholder="Nombre del tipo de comunicación" hide-details label="Buscar" 
                />

            </div>
            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto">
                
                <button
                    @click="addHandler"
                >
                    <ButtonBlack class="bg-gray-800 text-white hover:bg-gray-500">
                        <PlusCircleIcon/>
                        <template #text>Añadir</template>
                    </ButtonBlack>
                </button>
            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <div class="rounded-2xl">
                <div v-if="communicationStore.load">
                    <Spinner/>
                </div>

                <div v-else>
                    <v-data-table
                        :headers="headers"
                        :items="communicationStore.communications"
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        :search="search"
                    >

                        <template v-slot:item.actions="{ item }">
                            <div class="flex flex-col gap-2 my-2">
                                <button class="cursor-pointer text-green-500 hover:text-green-400 flex gap-1" 
                                    @click="editHandler(item)" 
                                >
                                    <PencilIcon
                                        class="w-5"
                                    />
                                    <p>Editar</p>
                                </button>

                                <button class="cursor-pointer text-red-500 hover:text-red-400 flex gap-1"
                                     @click="deleteHandler(item)"
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
</template>

<script setup>

import { ref } from 'vue'
import SearchInput from '../../../components/SearchInput.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { useCommunicationStore } from '../../../stores/communication';
import Swal from 'sweetalert2'
import Spinner from '../../../components/Spinner.vue';

const search = ref()
const communicationStore = useCommunicationStore();

const headers = [
    { key: 'name_communication', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'actions', title: 'Acciones'}
];

const itemsOption = [
    5, 10, 15, -1
]


const addHandler = () => {
    Swal.fire({
        title: 'Agregar medio de comunicación',
        html: `
            <form id="myForm" class="flex flex-col items-start">
                <label class="text-blue-500 mt-4 mb-1" for="name_communication">Nombre: </label>
                <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    type="text" 
                    id="name_communication"
                />
                <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
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
            const name_communication = document.getElementById('name_communication').value;
            const description = document.getElementById('description').value;

            if(!name_communication || !description ) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
                
            return { name_communication, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            communicationStore.create(result.value)
        }
    });
}

const editHandler = (item) => {
    Swal.fire({
        title: 'Editar medio de comunicación',
        html: `
            <form id="myForm" class="flex flex-col items-start">
                <label class="text-blue-500 mt-4 mb-1" for="name_communication">Nombre: </label>
                <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    type="text" 
                    id="name_communication"
                    value="${item.name_communication}"
                />
                <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                <textarea 
                    id="description" 
                    class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
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
            const name_communication = document.getElementById('name_communication').value;
            const description = document.getElementById('description').value;

            if(!name_communication || !description ) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
                
            return {id_communication_type: item.id_communication_type, name_communication, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            communicationStore.update(result.value)
        }
    });
}

const deleteHandler = async (item) => {
    
    const result = await Swal.fire({
        title: 'Eliminar medio de comunicación',
        text: ` Se eliminara el medio de comunicación "${item.name_communication}, en algunos casos no es posible borrar"`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        communicationStore.deleteCommunication(item)
    }
}

</script>

<template>
    <div class="max-w-[95%] mt-4 mx-auto">

        <div class="flex flex-col md:flex-row justify-between items-end mx-auto">
            <!-- Elemento de búsqueda -->
            <div class="w-full md:w-auto">
                <div class="relative mt-2 rounded-lg">
                    <input id="searchInput" type="text" placeholder="Buscar por el nombre"
                        class="w-full border border-gray-500 bg-white rounded-lg pl-10 focus:outline-none text-gray-500 text-sm py-2"
                        v-model="search">
                    <div class="absolute inset-y-0 left-0 flex items-center">
                        <MagnifyingGlassIcon class="h-5 mx-3" />
                    </div>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto ">
    
                <RouterLink :to="{ name: 'EquipmentHome' }">
                    <ButtonBlack class="bg-white hover:bg-gray-500">
                        <ArrowUturnLeftIcon />
                        <template #text>Regresar</template>
                    </ButtonBlack>
                </RouterLink>

                <button @click="addHandler">
                    <ButtonBlack class="bg-blue-500/80 hover:bg-blue-500 text-white">
                        <PlusCircleIcon/>
                        <template #text>Añadir</template>
                    </ButtonBlack>
                </button>
            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <div v-if="equipmentStore.load">
                <Spinner />
            </div>
            <div v-else>

                <p class="text-gray-700  font-semibold mb-5">Tipos de equipos</p>
                <div class="rounded-2xl">
                    <v-data-table :headers="headers" :items="equipmentStore.typeEquipments"
                        no-data-text="No hay datos disponibles" items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" :search="search">

                        <template v-slot:item.description="{ item }">
                            <span>{{ item.description }}</span>
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <div class="my-3 flex flex-row gap-2">
                    
                                <PencilIcon class="w-5 cursor-pointer text-green-500/80 hover:text-green-600"
                                    @click="editHandler(item)"    
                                />
                        
                                <TrashIcon class="w-5 cursor-pointer text-red-500/80 hover:text-red-600"
                                    @click="deleteHandler(item)"
                                />
                               
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
import { useEquipmentStore } from '../../../stores/equipment'
import Swal from 'sweetalert2'
import ButtonIcon from '../../../components/ButtonIcon.vue';
import { PlusCircleIcon, TrashIcon, PencilSquareIcon, ArrowUturnLeftIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/vue/24/solid'
import Spinner from '../../../components/Spinner.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';

const equipmentStore = useEquipmentStore()
const search = ref()
const itemsOption = [
    5, 10, 15, -1
]

const headers = [
    { key: "name_type_equipment", title: "Nombre" },
    { key: "description", title: "Descripción" },
    { key: 'actions', title: 'Acciones' }
];

const addHandler = () => {
    Swal.fire({
        title: "Nuevo tipo de material",
        html: `
                <form class="flex flex-col items-start">
                    <div class="flex">
                        <label for="name_type_equipment" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                        <input 
                            id="name_type_equipment" 
                            type="text" 
                            class=" bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        />
                    </div>

        
                    <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    ></textarea>
                    
                </form>
            `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const name = document.getElementById('name_type_equipment').value;
            const description = document.getElementById('description').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!name || !description) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            return { name_type_equipment: name, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            equipmentStore.createTypeEquipment(result.value)
        }
    });
}

const editHandler = (item) => {

    Swal.fire({
        title: 'Editar tipo de material',
        html: `
            <div class="flex flex-col items-start">
                    <div class="flex">
                        <label for="name_type_equipment" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                        <input 
                            id="name_type_equipment" 
                            type="text" 
                            class=" bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                            value="${item.name_type_equipment}"
                        />
                    </div>
        
                    <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    >${item.description}</textarea>
                    
                </div>
            `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const newName = document.getElementById('name_type_equipment').value;
            const newDescription = document.getElementById('description').value;
            
            if(!newName || !newDescription) {
                Swal.showValidationMessage('Llene los campos');
                return false
            }
  
            return { name_type_equipment: newName, description: newDescription, id_type_equipment: item.id_type_equipment };
        }

    }).then((result) => {
        if (result.isConfirmed) {
            equipmentStore.updateTypeEquipment(result.value)
        }
    });
}

const deleteHandler = async (item) => {
    console.log(item)
    const result = await Swal.fire({
        title: 'Eliminar tipo de equipo',
        text: ` Se eliminara el tipo de equipo "${item.name_type_equipment}", en algunos casos la eliminación no es posible`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        equipmentStore.deleteTypeEquipment(item)
    }
}
</script>


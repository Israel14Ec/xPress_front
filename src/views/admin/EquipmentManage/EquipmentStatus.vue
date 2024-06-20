<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto">

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

            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto">
                <RouterLink :to="{ name: 'EquipmentHome' }">
                    <ButtonBlack class="bg-white hover:bg-gray-500">
                        <ArrowUturnLeftIcon />
                        <template #text>Regresar</template>
                    </ButtonBlack>
                </RouterLink>
                
            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm p-5">
       
            <div v-if="equipmentStore.load">
                <Spinner/>
            </div>
            
            <div v-else>    
                <v-data-table
                    :headers="headers"
                    :items="equipmentStore.statusEquipments"
                    no-data-text="No hay datos disponibles" 
                    items-per-page-text="Mostrando"
                    :items-per-page-options="itemsOption" 
                    :search="search"
                >   

                <template v-slot:item.color="{ item }">
                    <div :style="{ backgroundColor: item.color }" class="w-6 h-6 rounded-full border border-gray-200"></div>
                </template>

                    <template v-slot:item.actions="{ item }">
                        <div class="my-3 flex flex-row gap-1">

                            <button   @click="editHandler(item)" class=" flex gap-2 text-green-500 hover:text-green-400">
                                <PencilIcon class="w-5 cursor-pointer"/>
                                <p>Editar</p>
                            </button>
                      
                       
                        </div>

                    </template>

                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
    
    import { ref } from 'vue'
    import { MagnifyingGlassIcon, PlusCircleIcon, ArrowUturnLeftIcon, PencilSquareIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'
    import {useEquipmentStore} from '../../../stores/equipment'
    import Swal from 'sweetalert2'
    import ButtonBlack from '../../../components/ButtonBlack.vue';
    import Spinner from '../../../components/Spinner.vue'

    const search = ref()
    const equipmentStore = useEquipmentStore()

    const headers = [
        { key: "name_status_equipment", title: "Nombre" },
        { key: "description", title: "Descripción"},
        { key: "color", title: "Color" },
        { key: 'actions', title: 'Acciones' }
    ];
    const itemsOption = [
        5, 10, 15, -1
    ]

    const addHandler = () => {
        Swal.fire({
            title: "Agregar estado",
            html: `
                <form class="flex flex-col items-start"> 
          
                    <div class="flex">
                        <label for="name_status_equipment" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                        <input 
                        id="name_status_equipment" 
                        type="text" 
                        class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        />
                    </div>
                    
                    <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    ></textarea>

                 
                    
                    <div class="flex mt-4">
                        <label for="color" class="text-blue-500 mb-1">Color: </label>  
                        <input 
                            id="color" 
                            name="color"
                            type="color" 
                            class="ml-4 w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                            value="#73D673"
                        />
                    </div>
                
                </form>

            `,
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
            },
            preConfirm: () => {
                const name = document.getElementById('name_status_equipment').value;
                const description = document.getElementById('description').value;
                const color = document.getElementById('color').value;

                // Comprueba si todos los campos requeridos están llenos
                if (!name || !description) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { name_status_equipment: name, description, color };
            }
        }).then((result) => {
        if (result.isConfirmed) {
                equipmentStore.createStatusEquipment(result.value)
            }
        });
    }

    const editHandler = (item) => {

        Swal.fire({
            title: 'Editar estado',
            html: `
                <form class="flex flex-col items-start"> 
                    
                    <div class="flex">
                        <label for="name_status_equipment" class="text-blue-500 mr-2 shrink-0">Nombre:</label>
                        <input 
                        id="name_status_equipment" 
                        type="text" 
                        class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white"
                        value="${item.name_status_equipment}" 
                        />
                    </div>
                    
                    <label for="description" class="text-blue-500 mt-4 mb-1">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    >${item.description}</textarea>

                    <div class="flex mt-4">
                        <label for="color" class="text-blue-500 mb-1">Color: </label>  
                        <input 
                            id="color" 
                            name="color"
                            type="color" 
                            class="ml-4 w-10 h-10 p-0 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                            value="${item.color}"
                        />
                    </div>
                
                </form>
            `,
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
            },
            preConfirm: () => {
                const newName = document.getElementById('name_status_equipment').value;
                const newDescription = document.getElementById('description').value;
                const newColor = document.getElementById('color').value;

                if(!newName || !newDescription ) {
                    Swal.showValidationMessage('Llene los campos');
                    return false
                }

                return { name_status_equipment: newName, description: newDescription, color: newColor, id_status_equipment: item.id_status_equipment };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value !== true) {
                equipmentStore.updateStatusEquipment(result.value)
            }
        })
    }

    const deleteHandler = async (item) => {

        const result = await Swal.fire({
            title: 'Eliminar estado',
            text: ` Se eliminara el estado "${item.name_status_equipment}", en algunos casos la eliminación no es posible`,
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            equipmentStore.deleteStatusEquipment(item)
        }
    }

</script>


<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto px-4">
            <div class="w-full md:w-1/2">
                <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined"  density="compact" 
                    placeholder="Nombre del cliente" hide-details label="Buscar" 
                />
            </div>

            <div class="flex justify-center gap-3 mt-3 md:mt-0 w-full md:w-auto">
                
                <ButtonBlack v-if="option === 1" class="bg-white hover:bg-gray-500" 
                    @click="option = 2"
                >
                    <TrashIcon/>
                    <template #text>Clientes eliminados</template>
                </ButtonBlack>

                <ButtonBlack v-if="option === 2" class="bg-white hover:bg-gray-500" 
                    @click="option = 1"
                >
                    <UserCircleIcon/>
                    <template #text>Clientes</template>
                </ButtonBlack>

                <ButtonBlack v-if="option === 1" class="bg-gray-700 hover:bg-gray-500  text-white" @click="addClientHandler">
                    <PlusCircleIcon/>
                    <template #text>Agregar</template>
                </ButtonBlack>
            </div>
        </div>
        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">

            <!--Clientes no eliminados-->
            <div v-if="option === 1">
                <p class="text-gray-700  font-semibold mb-5">Lista de clientes</p>
                <div v-if="clientStore.load">
                    <Spinner/>
                </div>
                <div v-else>
                    <div class="rounded-2xl">
                        <v-data-table
                            :headers="headers"
                            :items="clientStore.clients"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >
                            <template v-slot:item.actions="{ item }">
                                <div class="my-3 flex flex-col gap-2">
                                    
                                    <button  @click="editClientHandler(item)" class="text-green-500 hover:text-green-400 flex gap-1 cursor-pointer">
                                        <PencilIcon
                                            class="w-5 "
                                           
                                        />
                                        <p>Editar</p>
                                    </button>
                          
                                    
                                    <button  @click="deleteHandler(item)" class="cursor-pointer text-red-500 hover:text-red-400 flex gap-1">
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

            <!--Clientes eliminados-->
            <div v-else>
                <p class="text-red-600  font-semibold mb-5">Clientes eliminados</p>
                <div v-if="clientStore.load">
                    <Spinner/>
                </div>
                <div v-else>
                    <div class="rounded-2xl">
                        <v-data-table
                            :headers="headers"
                            :items="clientStore.deleteClients"
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >
                            <template v-slot:item.actions="{ item }">
                                <button class="flex justify-center items-center  gap-1 cursor-pointer text-green-500 hover:text-green-400">
                                    <ArrowUturnLeftIcon
                                    class="w-5 "
                                    @click="clientStore.restoreClient(item)" 
                                    />
                                    <p>Restaurar</p>
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

    import { ref, onMounted } from 'vue'
    import SearchInput from '../../../components/SearchInput.vue';
    import { PlusCircleIcon, TrashIcon, PencilIcon, UserCircleIcon, ArrowUturnLeftIcon } from "@heroicons/vue/24/solid";
    import { useClientStore } from '../../../stores/client';
    import Swal from 'sweetalert2'
    import Spinner from '../../../components/Spinner.vue';
    import ButtonBlack from '../../../components/ButtonBlack.vue';

    const search = ref()
    const clientStore = useClientStore()
    const option = ref(1)

    //Trae a los clientes eliminados
    onMounted(async () => {
        try {
            clientStore.getDeleteClient()

        } catch (error) {
            console.log(error)
        }
    })

    const headers = [
        { key: 'name_client', title: 'Nombre' },
        { key: 'description', title: 'Descripción' },
        { key: 'actions', title: 'Acciones'}
    ];

    const itemsOption = [
        5, 10, 15, -1
    ]

    const addClientHandler = () => {
        Swal.fire({
            title: "Agregar Cliente",
            html: `
                <form id="myForm" class="flex flex-col items-start">
                    <label class="text-blue-500 mt-4 mb-1" for="name_client">Nombre: </label>
                    <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="name_client"
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
                const name_client = document.getElementById('name_client').value;
                const description = document.getElementById('description').value;

                if(!name_client || !description ) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                
                return { name_client, description };
            }
            
        }).then((result) => {
        if (result.isConfirmed) {
                clientStore.createClient(result.value)
            }
        });
    }

    const editClientHandler = (item) => {
        
        Swal.fire({
            title: 'Editar usuario',
            html: `
                <form id="myForm" class="flex flex-col items-start">
                    
                    <label class="text-blue-500 mt-4 mb-1" for="name_client">Nombre: </label>
                    <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="name_client"
                        value="${item.name_client}"
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
                const name_client = document.getElementById('name_client').value;
                const description = document.getElementById('description').value;

                if(!name_client || !description ) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                
                return { id_client: item.id_client, name_client, description };
            }
        }).then((result) => {
        if (result.isConfirmed) {
                clientStore.updateClient(result.value)
            }
        });
    }

    const deleteHandler = async (item) => {
        const result = await Swal.fire({
            title: 'Eliminar cliente',
            text: ` Se eliminara el cliente "${item.name_client}""`,
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            clientStore.deleteClient(item)
        }
    }


</script>
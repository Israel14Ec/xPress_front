<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto px-4">

            <div class="w-full md:w-1/2">
                <div>
                    <div class="flex flex-col">

                        <v-text-field prepend-inner-icon="mdi-magnify" variant="underlined"  density="compact" 
                            placeholder="Nombre del tipo de comunicación" hide-details label="Buscar" 
                            v-model="departmentStore.search"
                            @input="handleSearch"  
                        />
                    </div>
                </div>
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
            <p class="text-gray-700  font-semibold mb-5">Lista de departamentos</p>

            <div v-if="departmentStore.load">
                <Spinner/>
            </div>

            <div v-else>
                <div v-if="departmentStore.filterDepartment.length !== 0" >
                    <CardDepartment 
                        v-for="department in departmentStore.filterDepartment" 
                        :key="department.id_department"
                        :department="department" 
                    />
                </div>
                <div v-else>
                    <p class="text-xl text-red-500 text-center font-bold mt-10">No hay registros</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>

import ButtonBlack from '../../../components/ButtonBlack.vue';
import { PlusCircleIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { useDepartmentStore } from '../../../stores/department';
import Swal from 'sweetalert2'
import CardDepartment from '../../../components/AdminComponents/CardDepartment.vue';
import Spinner from '../../../components/Spinner.vue';


const departmentStore = useDepartmentStore()

const addHandler = () => {
    Swal.fire({
        title: 'Añadir departamento',
        html: `
            <form id="myForm" class="flex flex-col items-start">
                <label class="text-blue-500 mt-4 mb-1" for="name_department">Nombre: </label>
                <input class="w-full bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                type="text" 
                id="name_department"
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
            
            const name_department = document.getElementById('name_department').value;
            const description = document.getElementById('description').value;

            if(!name_department || !description ) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
                
            return { name_department, description };
        }
    }).then((result) => {
        if (result.isConfirmed) {
                departmentStore.createDepartment(result.value)
        }
    });
}

</script>


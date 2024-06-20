<template>
    <div class="mt-7 shadow-md p-2 rounded-2xl mx-auto max-w-[95%] md:max-w-[60%]">
        <div class="flex flex-col md:flex-row items-center justify-center gap-5">
            <div class="w-full md:w-2/3">
                <div class=" border-b-2 border-gray-400">
                    <p class="text-gray-700 font-semibold text-lg">Nombre: <span class="font-normal"> {{ department.name_department }}</span> </p>
                </div>

                <div class="my-3 py-3 text-sm text-gray-600"> 

                    <p class=" font-semibold">Descripcion: </p>
                    <p class="text-sm mb-3"> {{ department.description }}</p> 
                    <div v-if="department.users_quantity > 0">
                        <p class="font-semibold mb-3">Cantidad de usuarios: <span class="font-normal"> {{ department.users_quantity}}</span></p>
                    </div>
                    <div v-else>
                        <p class="text-red-500 font-bold">No hay usuarios registrados</p>
                    </div>
                </div>
            </div>

            <div class="w-auto">
                <div class="flex md:flex-col gap-3">

                    <ButtonIcon class="bg-green-400"
                        @click="departmentStore.editDepartment(department)"
                    >
                        <PencilIcon />
                        <template #text>Editar</template>
                    </ButtonIcon>

                    <ButtonIcon class="bg-red-400"
                        @click="departmentStore.deleteDepartment(department)"
                    >
                        <TrashIcon />
                        <template #text>Eliminar</template>
                    </ButtonIcon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    
    import { useDepartmentStore } from '../../stores/department';
    import ButtonIcon from '../ButtonIcon.vue';
    import { PencilIcon, TrashIcon} from "@heroicons/vue/24/solid";
  

    const departmentStore = useDepartmentStore()

    defineProps({
        department: {
            type: Object
        }
    })

</script>
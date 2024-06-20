<template>
    <div class="max-w-[90%] mt-4 mx-auto">

        <div class=" flex justify-between items-center mb-5">
            <div class="flex flex-row gap-2 mb-3 text-gray-700 font-semibold">
                <div class="w-6 my-auto">
                    <PencilSquareIcon />
                </div>
                <p class="text-lg">Agregar nuevo equipo</p>
            </div>

            <RouterLink :to="{ name: 'EquipmentHome' }">
                <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                    <ArrowUturnLeftIcon />
                    <template #text>
                        Regresar
                    </template>
                </ButtonBlack>
            </RouterLink>
        </div>


        <div class="flex flex-col xl:flex-row gap-4">
            <div class="lg:w-4/12 w-1/2 mx-auto">
                <div class="bg-white p-5 border-t-4 border-gray-700 shadow-md">

                    <div v-if="selectedImage">
                        <img class="rounded-xl" :src="selectedImage" alt="Imagen del material seleccionado">
                    </div>
                    <div v-else>
                        <img class="rounded-xl w-full h-auto max-h-full" src="/equipamiento.png" alt="Equipos">
                    </div>

                </div>

            </div>

            <div class="w-full rounded-sm">
                <div class="bg-white border-t-4 py-1 border-gray-700">
                    <p class="text-gray-800 font-semibold ml-5 my-5 text-sm uppercase">Detalles del equipo</p>
                    <div class="max-w-[90%] md:max-w-[75%] mx-auto">
                        <FormKit id="equipmentForm" type="form" :actions="false"
                            incomplete-message="Complete todos los campos" v-model="equipmentStore.formEquipment"
                            @submit="equipmentStore.createEquipment">

                            <div class="flex flex-col">
                                <div class="flex flex-row gap-5">
                                    <div class="w-1/2">
                                        <FormKit type="text" label="Nombre: " name="name_equipment"
                                            placeholder="Ingrese el nombre" validation="required" :validation-messages="{
                                                required: 'El nombre es obligatorio'
                                            }" />
                                    </div>

                                    <div class="w-1/2">
                                        <FormKit type="file" label="Imagen" name="image"
                                            help="Seleccione una imagen (jpg, png, jpeg, webp)" accept=".jpg,.png,.jpeg,.webp"
                                            fileRemoveIcon="close" fileItemIcon="fileImage" noFilesIcon="fileImage"
                                            @change="handleImageChange" />
                                    </div>

                                </div>
                                <div class="">
                                    <FormKit type="textarea" name="description" label="Descripción"
                                        placeholder="Añada una descripción del material" validation="length:1,300"
                                        :validation-messages="{
                                            length: 'Se admiten máximo 300 caracteres',
                                        }"
                                        :help="`${equipmentStore.formEquipment.description ? equipmentStore.formEquipment.description.length : 0} / 300`" />
                                </div>

                                <div class="flex flex-row gap-5">
                                    <div class="w-1/2">
                                        <FormKit type="select" label="Estado del material" name="id_status_equipment"
                                            placeholder="Seleccione un estado" :options="equipmentStore.statusOptions"
                                            selectIcon="down" validation="required" :validation-messages="{
                                                required: 'No se selecciono un estado'
                                            }" />

                                    </div>
                                    <div class="w-1/2">
                                        <FormKit type="select" label="Tipo de equipamiento" name="id_type_equipment"
                                            placeholder="Seleccione el tipo" :options="equipmentStore.typeOptions"
                                            selectIcon="down" validation="required" :validation-messages="{
                                                required: 'No se selecciono un estado'
                                            }" />


                                    </div>
                                </div>
                                <FormKit type="number" label="Precio" name="unit_value" number placeholder="$$"
                                    validation="required|min:1" :validation-messages="{
                                        required: 'El precio es obligatorio',
                                        min: 'El precio debe ser mayor que 0',
                                    }" step="0.01" />
                            </div>
                            <FormKit type="submit">
                                Guardar
                            </FormKit>
                        </FormKit>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { watch, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { PencilSquareIcon } from '@heroicons/vue/24/solid'
import { useEquipmentStore } from '../../../stores/equipment'
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import UseImage from '../../../composables/useImage'
import ButtonBlack from '../../../components/ButtonBlack.vue';

const { showImage, selectedImage } = UseImage()
const equipmentStore = useEquipmentStore()

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};

//Escucha por los cambios de la imagen
watch(() => equipmentStore.formEquipment.image, (newValue, oldValue) => {
    try {
        if (newValue.length === 0) {
            selectedImage.value = ""
        }
    } catch (error) {
        console.log(error)
    }
  
});

onUnmounted(() => {
    equipmentStore.formEquipment = {}
});

</script>

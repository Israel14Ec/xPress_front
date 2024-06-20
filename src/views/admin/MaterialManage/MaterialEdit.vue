<template>
    <div class="max-w-[97%] mt-4 mx-auto">

        <div class="flex justify-between items-center mb-5">

            <div class="flex flex-row gap-2 mb-3 text-yellow-500 font-semibold">
                <div class="w-6 my-auto">
                    <PencilSquareIcon />
                </div>
                <p class="text-lg">Editar material</p>
            </div>

            <RouterLink :to="{ name: 'MaterialHome' }">
                <ButtonBlack>
                    <ArrowUturnLeftIcon />
                    <template #text>
                        Regresar
                    </template>
                </ButtonBlack>
            </RouterLink>
        </div>


        <div class="flex flex-col xl:flex-row  gap-4">

            <div class="lg:w-4/12 w-1/2 mx-auto">
                <div class="bg-white p-5 border-t-4 border-yellow-500 shadow-md">
                    <div>
                        <div v-if="materialStorage.load">
                            <Spinner />
                        </div>
                        <div v-else class="my-auto">
                            <div>
                                <img :src="selectedImage || '/materiales.png'" alt="Imagen del material"
                                    class="w-full h-auto max-h-full">
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="w-full rounded-sm">
                <div class="bg-white border-t-4 py-1  border-yellow-500">
                    <p class="text-yellow-500 font-semibold ml-5 my-5 text-sm uppercase">Detalles del material a editar
                    </p>
                    <div class="max-w-[90%] md:max-w-[75%] mx-auto">
                        <div v-if="materialStorage.load">
                            <Spinner />
                        </div>
                        <div v-else>
                            <FormKit id="FormMaterialEdit" v-model="formData" type="form" :actions="false"
                                @submit="editHandler" incomplete-message="Complete todos los campos">
                                <div class="flex flex-col">
                                    <div class="">
                                        <div class="flex flex-row gap-5">
                                            <div class="w-1/2">

                                                <FormKit type="text" label="Nombre: " name="name_material"
                                                    placeholder="Ingrese el nombre" validation="required"
                                                    :validation-messages="{
                                                        required: 'El nombre es obligatorio'
                                                    }" />

                                            </div>
                                            <div class="w-1/2 ">
                                                <FormKit type="file" label="Imagen" name="image"
                                                    help="Seleccione una imagen (jpg, png, jpeg)"
                                                    accept=".jpg,.png,.jpeg" @change="handleImageChange"
                                                    fileRemoveIcon="close" fileItemIcon="fileImage"
                                                    noFilesIcon="fileImage" />

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="">
                                            <FormKit type="textarea" name="description" label="Descripción"
                                                placeholder="Añada una descripción del material"
                                                validation="length:1,300" :validation-messages="{
                                                    length: 'Se admiten máximo 300 caracteres',
                                                    required: 'La descripción es obligatoria'
                                                }"
                                                :help="`${formData.description ? formData.description.length : 0} / 300`" />
                                        </div>
                                    </div>
                                    <div class="">
                                        <div class="flex flex-row gap-5">
                                            <div class="w-1/2">

                                                <FormKit type="number" label="Valor unitario" name="unit_value" number
                                                    placeholder="$$" validation="required|min:0.01"
                                                    :validation-messages="{
                                                        required: 'El valor unitario es obligatorio',
                                                        min: 'El valor unitario debe ser mayor que 0',
                                                    }" step="0.01" />


                                            </div>
                                            <div class="w-1/2">
                                                <FormKit type="number" label="Cantidad" name="stock" number="integer"
                                                    placeholder="Stock inicial" validation="required|numeric|min:1"
                                                    :validation-messages="{
                                                        required: 'El stock es obligatorio',
                                                        numeric: 'Ingrese un valor numérico',
                                                        min: 'El stock debe ser mayor que 0',
                                                    }" />
                                            </div>
                                        </div>

                                        <FormKit type="select" label="Magnitud para la medida" name="id_magnitude_value"
                                            prefix-icon="repeater" placeholder="seleccione una magnitud"
                                            :options="valueStore.valuesFormatMagtnitudes" validation="required"
                                            :validation-messages="{
                                                required: 'Seleccione una magnitud'
                                            }" />
                                        <label class="text-red-500 text-xl mt-4 font-bold">Total:
                                            <span class="text-gray-700 font-normal text-base ml-4">
                                                {{ materialStorage.calcTotal }}</span>
                                        </label>
                                        <FormKit type="submit">
                                            Guardar Cambios
                                        </FormKit>
                                    </div>
                                </div>
                            </FormKit>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>

</template>

<script setup>

import { onMounted, ref, watch, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMaterialStore } from '../../../stores/material';
import { useMagnitudeValue } from '../../../stores/magnitudeValue'
import { storeToRefs } from 'pinia';
import { PencilSquareIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import { isBlobUrl } from '../../../helpers/utils'
import useImage from '../../../composables/useImage';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import Spinner from '../../../components/Spinner.vue';



const route = useRoute();
const { showImage, selectedImage, uploadImage, url, deleteImage } = useImage()
const materialStorage = useMaterialStore()
const { formData } = storeToRefs(materialStorage);

const valueStore = useMagnitudeValue()
const imageOrigin = ref("")

//Cargo los datos 
onMounted(async () => {
    formData.value = await materialStorage.getMaterialById(route.params.id)
    selectedImage.value = formData.value.image
    imageOrigin.value = formData.value.image
});

const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};

//Reestablece la foto a su valor original si da en x
watch(() => formData.value.image, (newValue, oldValue) => {

    if (formData.value.image) {
        if (newValue.length === 0) {
            selectedImage.value = imageOrigin.value
        }
    }
});


const editHandler = async () => {

    if (selectedImage.value) {

        if (isBlobUrl(selectedImage.value)) { // Imagen nueva
            const file = formData.value.image[0].file

            if (imageOrigin.value) {
                await deleteImage(imageOrigin.value) //Eliminamos foto anterior
            }
            await uploadImage(materialStorage.nameDocument, file) //Cargamos
            formData.value.image = url.value
        } else {
            formData.value.image = imageOrigin.value //Imagen Original
        }
    } else {
        console.log("No hay imagen")
        formData.value.image = ""
    }
    materialStorage.updateMaterial(formData.value)
}

//Desmonta el componente
onUnmounted(() => {
    formData.value = {};
});


</script>
<template>
    <div class="max-w-[97%] mt-4 mx-auto">
        
        <div class=" flex justify-between items-center mb-4">

            <div class="flex flex-row gap-2 mb-3 text-gray-700 font-semibold">
                <div class="w-6 my-auto">
                        <PencilSquareIcon/>
                </div>
                <p class="text-lg">Agregar nuevo material</p>
            </div>

            <div class="flex flex-col md:flex-row gap-3 justify-center">
                    
                    <RouterLink :to="{ name: 'MagnitudeMaterial'}">
                        <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                            <DocumentChartBarIcon />
                            <template #text>
                            Magnitudes
                            </template>
                        </ButtonBlack>
                    </RouterLink>
                    
                    <RouterLink
                        :to="{name: 'MaterialHome'}"
                    >
                        <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                            <ArrowUturnLeftIcon/>
                            <template #text>
                                Regresar
                            </template>
                        </ButtonBlack>
                    </RouterLink>
                </div>
        </div>

        <div class="flex flex-col xl:flex-row  gap-4">

            <div class="lg:w-4/12 w-1/2 mx-auto">
                <div class="bg-white p-5 border-t-4 border-gray-700  shadow-md">
                    <div>
                        <div v-if="selectedImage">
                            <img class="rounded-xl" :src="selectedImage" alt="Imagen del material seleccionado">
                        </div>
                        <div v-else>
                            <img class="rounded-xl w-full h-auto max-h-full" src="/materiales.png" alt="materiales" >
                        </div>
                    </div>
                </div>
           
            </div>

            <div class="w-full rounded-sm">
                <div class="bg-white border-t-4 py-1 border-gray-700">
                    <p class="text-gray-500 uppercase font-semibold ml-5 my-5 text-sm">Detalles del material</p>
                    <div class="max-w-[90%] md:max-w-[75%] mx-auto">
                        <FormKit 
                            id="FormMaterial"
                            type="form"   
                            :actions="false"
                            incomplete-message="Complete todos los campos"
                            @submit="materialStore.createMaterial"
                            v-model="materialStore.formData"                  
                        >
                            <div class="flex flex-col">
                                <div class="">
                                    <div class="flex flex-row gap-5">
                                        <div class="w-1/2">

                                            <FormKit
                                                type="text"
                                                label="Nombre: "
                                                name="name_material"
                                                placeholder="Ingrese el nombre"
                                                validation="required"
                                                :validation-messages = "{
                                                    required: 'El nombre es obligatorio'
                                                }"
                                            />

                                        </div>
                                        <div class="w-1/2 ">
                                            <FormKit
                                                type="file"
                                                label="Imagen"
                                                name="image"
                                                help="Seleccione una imagen (jpg, png, jpeg, webp)"
                                                accept=".jpg,.png,.jpeg,.webp"
                                                @change="handleImageChange"
                                                fileRemoveIcon="close"
                                                fileItemIcon="fileImage"
                                                noFilesIcon="fileImage"
                                                validation="required"
                                                :validation-messages = "{
                                                    required: 'La imagen es obligatoria'
                                                }"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <div class="">
                                        <FormKit
                                            type="textarea"
                                            name="description"
                                            label="Descripción"
                                            placeholder="Añada una descripción del material"
                                            validation="length:1,300|required"
                                            :validation-messages="{
                                                length: 'Se admiten máximo 300 caracteres',
                                                required: 'La descripción es obligatoria'
                                            }"
                                            :help="`${materialStore.formData.description ? materialStore.formData.description.length  : 0} / 300`"
                                        />
                                    </div>
                                </div>
                                <div class="">
                                    <div class="flex flex-row gap-5">
                                    <div class="w-1/2">   
                                        <FormKit
                                            type="number"
                                            label="Valor unitario"
                                            name="unit_value"
                                            number
                                            placeholder="$$"
                                            validation="required|min:0.01"
                                            :validation-messages="{
                                                required: 'El valor unitario es obligatorio',
                                                min: 'El valor unitario debe ser mayor que 0',
                                            }"
                                            step="0.01"
                                        />
                                    </div>
                                        <div class="w-1/2">
                                            <FormKit
                                                type="number"
                                                label="Cantidad"
                                                name="stock"
                                                number="integer"
                                                placeholder="Stock inicial"
                                                validation="required|numeric|min:1"
                                                :validation-messages="{
                                                    required: 'El stock es obligatorio',
                                                    numeric: 'Ingrese un valor numérico',
                                                    min: 'El stock debe ser mayor que 0',
                                                }"
                                            />
                                        </div>
                                    </div>
                                    
                                    <FormKit 
                                        type="select"
                                        label="Magnitud para la medida"
                                        name="id_magnitude_value"
                                        prefix-icon="repeater"
                                        placeholder="seleccione una magnitud"
                                        :options="valueStore.valuesFormatMagtnitudes"
                                        validation="required"
                                        :validation-messages="{
                                            required: 'Seleccione una magnitud'
                                        }"
                    
                                    />

                                    <label class="text-red-500 text-xl mt-4 font-bold">Total:  
                                        <span class="text-gray-700 font-normal text-base ml-4"> {{ materialStore.calcTotal }}</span>
                                    </label>
                                    <FormKit
                                    type="submit"
                                    >
                                        Guardar
                                    </FormKit>
                                </div>
                            </div>
                        </FormKit>
                    </div>
                </div>
              
            </div>
        </div>
    
    </div>

</template>

<script setup>

    import { watch} from 'vue'
    import { RouterLink } from 'vue-router'
    import { useMaterialStore } from '../../../stores/material'
    import { useMagnitudeValue } from '../../../stores/magnitudeValue'
    import { PencilSquareIcon, ArrowUturnLeftIcon, DocumentChartBarIcon } from '@heroicons/vue/24/solid'
    import useImage from '../../../composables/useImage';
    import ButtonBlack from '../../../components/ButtonBlack.vue'
    
    
    const { showImage, selectedImage} = useImage()
    const materialStore = useMaterialStore()
    const valueStore = useMagnitudeValue()

    //Se ejecuta cuando se carga una imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        showImage(file)
    };


    //Escucha por los cambios de la imagen
    watch(() => materialStore.formData.image, (newValue, oldValue) => {
        // Verifica si newValue es una cadena y su longitud es 0
        try {
            if (newValue.length === 0) {
                selectedImage.value = "";
            }

        } catch (error) {
            console.log(error)
        }
   
    });



</script>


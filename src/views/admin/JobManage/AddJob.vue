<template>
    <div class="max-w-[95%] mt-5 mx-auto ">
        <div class="flex flex-row justify-between">
            <div class="flex flex-row gap-2 mb-3 text-gray-700 font-semibold">
                <div class="w-6 my-auto">
                    <PencilSquareIcon />
                </div>
                <p class="text-lg">Agregar trabajos</p>
            </div>
            <div>
                <RouterLink
                        :to="{name: 'JobHome'}"
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


        <div class="flex flex-col xl:flex-row gap-4">

            <div class="lg:w-4/12 w-full mx-auto">
                <div class="bg-white p-5 border-t-4 border-gray-700 shadow-m">
                    <div class=" shadow-md">
                        <div v-if="selectedImage">
                            <img class="rounded-xl" :src="selectedImage" alt="Imagen del material seleccionado">
                        </div>
                        <div v-else>
                            <img class="rounded-xl w-full h-auto max-h-full" src="/trabajo.png" alt="materiales" >
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full rounded-lg">
                <div class="bg-white border-t-4 p-y-1 border-gray-700">
                    <p class="text-gray-500 uppercase font-semibold ml-5 my-5 text-sm">Detalles del trabajo</p>
                    <div class="max-w-[90%] md:max-w-[75%] mx-auto">
                        <FormKit 
                            id="jobForm"
                            type="form"
                            :actions="false"
                            incomplete-message="Revise los mensajes de los campos"
                            v-model="jobStore.formJob"
                            @submit="jobStore.createJob"
                        >
                            <div class="flex flex-col md:flex-row gap-5">
                                <div class="w-full md:w-1/2">
                                    <FormKit type="text" label="Nombre: " name="name_job"
                                        placeholder="Nombre del trabajo" validation="required" :validation-messages="{
                                            required: 'El nombre es obligatorio'
                                        }" />
                                </div>
                                <div class="w-full md:w-1/2">
                                    <FormKit type="text" label="Numero de CAF: " name="num_caf"
                                        placeholder="Caso del trabajo"
                                    />
                                </div>
                            </div>

                            <FormKit type="textarea" name="description" label="Descripción"
                                placeholder="Añada una descripción del trabajo" validation="required"
                                :validation-messages="{
                                    required: 'La descripción es obligatoria'
                                }" />
                            <div class="w-full">
                                <FormKit type="file" label="Imagen" name="before_picture"
                                accept=".jpg,.png,.jpeg" fileRemoveIcon="close" fileItemIcon="fileImage" noFilesIcon="fileImage"
                                @change="handleImageChange"
                                />

                            </div>
                     
                            <div class="flex flex-col md:flex-row gap-5">
                                <div class="w-full md:w-1/2">
                                   
                                    <FormKit type="select" label="Medio de comunicación" name="id_communication_type"
                                        placeholder="Ej: correo, email, etc" selectIcon="down" validation="required"
                                        :options="communicationsOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />
                                    <FormKit type="select" label="Tipo de mantenimiento" name="id_type_maintenance"
                                        placeholder="Seleccione" selectIcon="down" validation="required"
                                        :options="maintenanceOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />

                                    <FormKit type="select" label="Estado" name="id_job_status"
                                        placeholder="Seleccione" selectIcon="down" validation="required"
                                        :options="statusOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />
                                </div>
                                
                                <div class="w-full md:w-1/2">
                                    <FormKit type="select" label="Prioridad" name="id_job_priority"
                                        placeholder="Ej: desarrollo normal, emergente, etc" selectIcon="down" validation="required"
                                        :options="prioritiesOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />
                                    <FormKit type="select" label="Local" name="id_establishment"
                                        placeholder="Seleccione un local" selectIcon="down" validation="required"
                                        :options="establishmentOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />
                                        
                                    <FormKit type="select" label="Cliente" name="id_client"
                                        placeholder="Seleccione un cliente" selectIcon="down" validation="required"
                                        :options="clientsOption"
                                        :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />

                                </div>
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

import { storeToRefs } from 'pinia'
import { watch, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { PencilSquareIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import { useJobStore } from '../../../stores/job'
import { useOptionJobStore } from '../../../stores/optionsJob'
import useImage from '../../../composables/useImage';
import ButtonBlack from '../../../components/ButtonBlack.vue'

const { showImage, selectedImage} = useImage()

const jobStore = useJobStore()
const jobOption = useOptionJobStore()
const { 
    clientsOption, 
    prioritiesOption, 
    establishmentOption, 
    communicationsOption, 
    maintenanceOption,
    statusOption } = storeToRefs(jobOption)

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};

//Escucha por los cambios de la imagen
watch(() => jobStore.formJob.image, (newValue, oldValue) => {
    if (newValue.length === 0) {
        selectedImage.value = ""
    }
});

onUnmounted(() => {
    jobStore.formJob = {}
})

</script>

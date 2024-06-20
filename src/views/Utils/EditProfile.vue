<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="bg-white p-5 rounded-lg">
            <div class="max-w-[90%] md:max-w-[60%] p-5 mx-auto">
                <div class="flex justify-center">
                    <div class="flex-shrink-0 h-28 w-28 rounded-full overflow-hidden ring-2 ring-gray-400 relative">
                        <div class="flex items-center justify-center bg-gray-200 w-full h-full rounded-full overflow-hidden">
                            <template v-if="selectedImage">
                                <img class="object-cover w-full h-full" 
                                    :src="selectedImage" 
                                    alt="Imagen de perfil">
                            </template>
                            <template v-else>
                                <CameraIcon class="w-9" />
                            </template>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center">
                    <label for="fileInput" 
                        class=" text-blue-400 text-xs font-semibold mt-2 cursor-pointer hover:text-blue-300">
                        Actualizar foto
                    </label>
                    <input id="fileInput" type="file" @change="handleImageChange" accept="image/*" class="hidden">
                    
                </div>
                <p v-if="selectedImage" class="text-xs text-red-500 hover:text-red-600 text-center cursor-pointer"
                    @click="deleteImageHandler()"
                >Eliminar foto</p>

                <div class="mt-10">
                    <FormKit 
                        type="form"
                        :actions="false" 
                        incomplete-message="Complete todos los campos"
                        v-model="dataUserForm"
                        @submit="profile.updateUserProfile()"
                        >
                        
                        <div class="flex flex-col md:flex-row gap-5 mt-5">
                            <div class="md:w-1/2">
                                <FormKit type="text" label="Nombre" name="name" placeholder="Ingrese su nombre"
                                    validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\\s]+$/" :validation-messages="{
                                        required: 'El nombre es obligatorio',
                                        matches: 'Ingrese un nombre válido'
                                    }" />

                                <FormKit type="tel" label="Número de teléfono" name="phone_number" placeholder="xxx-xxx-xxxx"
                                    validation="matches:/^[0-9]{10}$/" :validation-messages="{
                                        matches: 'Ingrese solo 10 digitos'
                                    }" />


                            </div>
                            <div class="md:w-1/2">
                                <FormKit type="text" label="Apellido " name="last_name" placeholder="Ingrese su apellido"
                                    validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/ " :validation-messages="{
                                        required: 'El apellido es obligatorio',
                                        matches: 'Ingrese un apellido válido'
                                    }" />

                                <FormKit type="text" label="Correo electrónico " name="email"
                                    placeholder="Ingrese su nombre" :readonly="true"
                                        help="No se puede moficar"
                                    />
                            </div>
                        </div>

                        <FormKit type="submit">
                            Guardar cambios
                        </FormKit>


                    </FormKit>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../../stores/profile'
import { CameraIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import UseImage from '../../composables/useImage'


const { showImage, selectedImage, deleteImage} = UseImage()
const profile = useProfileStore()
const { dataUserForm, image } = storeToRefs(profile)

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    image.value = file //Valor de la imagen
    showImage(file)
};


onMounted(() => {
    selectedImage.value = dataUserForm.value.image //Foto original
})

//Eliminar imagen
function deleteImageHandler() {
    try {


        if(selectedImage.value == dataUserForm.value.image) { //Se eliminara la foto actual de la base de datos
            deleteImage(dataUserForm.value.image)
            profile.deleteImagePerfil()
            selectedImage.value = null //Esteblece en null el valor
            dataUserForm.value.image = null
        }
        else { //Se eliminara la imagen del ref
            selectedImage.value = dataUserForm.value.image//Regresa la imagen a su valor original
            image.value = selectedImage.value //Regresa
        } 
    } catch (error) {
        console.log(error)
    }
}

</script>

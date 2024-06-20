import { ref, onMounted, inject } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import UserApi from '../api/UserApi'
import useImage from '../composables/useImage'
import { isBlob } from '../helpers/utils'

export const useProfileStore = defineStore('profiles', () => {

    const { uploadImage, url, deleteImage } = useImage()
    const auth = useAuthStore()
    
    const dataUserForm = ref()
    const image = ref(null)
    const nameDocument = 'imagenPerfil'

    const toast = inject('toast')

    const { userData } = storeToRefs(auth)

    onMounted(() => {
        try {
            dataUserForm.value = { ...userData.value };//Datos del usuario
        } catch (error) {
            console.log(error)
        }
     
    })

    //Eliminar foto de perfil
    async function deleteImagePerfil() {
        try {
            const { data } = await UserApi.deleteProfileImage(userData.value.id_user)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            image.value = null
            userData.value.image = null

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Guardar cambios
    async function updateUserProfile() {
        try {

            if(isBlob(image.value)) { //hay nueva imagen
                if(dataUserForm.value.image) {
                    await deleteImage(dataUserForm.value.image) //Eliminar imagen original
                } 
                await uploadImage(nameDocument, image.value) //Subir nueva foto
                dataUserForm.value.image = url.value //Guarda en la db
                image.value = url.value
            } 

            const { data } = await UserApi.updateUserProfile(dataUserForm.value.id_user, dataUserForm.value)
            userData.value = {...dataUserForm.value} //Actualizo los datos originales del usuario
            
            toast.open({
                message: data.msg,
                type: 'success'
            })

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }



    return {
        dataUserForm,
        image,
        deleteImagePerfil,
        updateUserProfile
    }
})
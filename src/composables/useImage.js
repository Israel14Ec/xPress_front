import { ref, computed } from 'vue'
import { useFirebaseStorage } from 'vuefire'
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
import { uid } from 'uid'

export default function useImage() {
    const storage = useFirebaseStorage()
    const url = ref('')
    const selectedImage = ref('')

    const showImage = (e) => {
        selectedImage.value = URL.createObjectURL(e);
    };

    const uploadImage = (nameDocument, file) => { 

        try {
            url.value = '';
            const filename = uid(8) + `.${file.name.split('.').pop()}`;
            const sRef = storageRef(storage, `/${nameDocument}/` + filename);

            return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(sRef, file);

                uploadTask.on('state_changed', 
                    () => {},
                    (error) => reject(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadUrl) => {
                                url.value = downloadUrl;
                                resolve(url.value);
                            })
                            .catch((error) => {
                                reject(error);
                        });
                    }
                );
            });
        } catch (error) {
            console.log(error)
        }
    }

    const deleteImage = async (urlImage) => {
        console.log(urlImage)
        try {
            const imageRef = storageRef(storage, urlImage); //Referencia de la imagen a eliminar
            await deleteObject(imageRef);
        } catch (error) {
            console.log(error)
        }
    }

    const isShowImage = computed(() => {
        return selectedImage.value ? selectedImage.value : null;
    });

    return {
        selectedImage,
        url,
        deleteImage,
        uploadImage,
        isShowImage,
        showImage,
    }
}

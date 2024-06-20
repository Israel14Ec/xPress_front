import {defineStore} from 'pinia'
import {onMounted, ref} from 'vue'
import RolApi from '../api/RolApi'


export const useRolStore = defineStore('roles', ()=> {

    const roles = ref([])

    onMounted(async () => {
        try {
            const {data} = await RolApi.get()
            roles.value = data
        } catch (error) {
            console.log(error)
        }
    })

    async function getRolById (id) {
        try {
            const {data} = await RolApi.getRolById(id)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    return {
        roles,
        getRolById
    }
}) 
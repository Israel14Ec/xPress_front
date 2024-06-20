import { defineStore } from "pinia";
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import DepartmentApi from "../api/DepartmentApi";

export const useUtilsStore = defineStore('utils', () => {

    const department = ref()
    const auth = useAuthStore()

    const departmentId = auth.userData.id_department
    //Obtiene el departamenro segun el id
    async function getDepartmentById() {
        try {
            const { data } = await DepartmentApi.getDepById(departmentId)
            department.value = data.name_department

        } catch (error) {
            console.log(error)
        }
    }

    return {
        department,
        getDepartmentById
    }
})
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import DepartmentApi from '../api/DepartmentApi' 

export const useCreateAccountStore = defineStore('createAccount', () => {

    const departmentOption = ref([])

    onMounted( async () => {
        try {
            const { data } = await DepartmentApi.getDepartmentWithOutAdmin()
            departmentOption.value = data.reduce((obj, department) => {
                obj[department.id_department] = department.name_department;
                return obj;
            }, {});

        } catch (error) {
            console.log(error)
        }
    })

    return {
        departmentOption
    }
})  
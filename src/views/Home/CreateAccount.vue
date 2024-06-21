<template>
    <div class="mx-auto p-5 shadow-gray-300">
        <h1 class="text-center text-yellow-400 text-2xl font-bold mt-3 mb-10 uppercase">Registrate</h1>

        <div class="">

            <FormKit id="CreateForm" type="form"  :actions="false" incomplete-message="Revisa las alertas"
                @submit="handleSubmit">

                <div class="flex flex-col md:flex-row md:gap-x-14">

                    <div class="w-full md:w-1/2">
                        <FormKit type="text" label="Nombre" name="name" placeholder="Ingrese su nombre"
                            validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\\s]+$/" :validation-messages="{
                                required: 'El nombre es obligatorio',
                                matches: 'Ingrese un nombre válido'
                            }" prefix-icon="people" />
                            
                    </div>

                    <div class="w-full md:w-1/2">
                        <FormKit type="text"  label="Apellido " name="last_name" placeholder="Ingrese su apellido"
                            validation="required|matches:/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/ " :validation-messages="{
                                required: 'El apellido es obligatorio',
                                matches: 'Ingrese un apellido válido'
                            }" prefix-icon="people" />
                    </div>

                </div>


                <FormKit type="tel"  label="Número de teléfono" name="phone_number" placeholder="xxx-xxx-xxxx"
                    validation="matches:/^[0-9]{10}$/" :validation-messages="{
                        matches: 'Ingrese solo 10 digitos'
                    }" prefix-icon="telephone" />


                <FormKit type="select" label="Departamento" placeholder="Seleccione un departamento" name="id_department"
                    validation="required" :validation-messages="{
                        required: 'Seleccionar un departamento es obligatorio'
                    }" :options=createAccount.departmentOption prefix-icon="repeater" />

                <FormKit type="text" label="Correo electrónico " name="email" placeholder="Ingrese su nombre"
                    validation="required|email" :validation-messages="{
                        required: 'El correo es obligatorio',
                        email: 'Ingrese un correo electrónico válido'
                    }" prefix-icon="email" />


                <div class="flex flex-col md:flex-row md:gap-x-14">

                    <div class="w-full lg:w-1/2">
                        <FormKit type="password" label="Ingrese su contraseña" name="password"
                            validation="required|length:8" :validation-messages="{
                                required: 'El contraseña es obligatorio',
                                length: 'La contraseña debe contener al menos 8 caracteres'
                            }" autocomplete="current-password" prefix-icon="eyeClosed"
                            @prefix-icon-click="handleIconClick" />
                    </div>

                    <div class="w-full lg:w-1/2">
                        <FormKit type="password" label="Confirme su contraseña" name="password_confirm"
                            validation="required|confirm" :validation-messages="{
                                required: 'Confirmar la contraseña es obligatorio',
                                confirm: 'Las contraseñas no coinciden'
                            }" autocomplete="current-password" prefix-icon="eyeClosed"
                            @prefix-icon-click="handleIconClick" />
                    </div>
                </div>

                <FormKit type="submit">
                    Registrarse
                </FormKit>

            </FormKit>
            <RouterLink :to="{name:'login'}" class=" text-yellow-500 text-center font-semibold">
                <p>Inicio</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>

import { inject } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import UserApi from '../../api/UserApi'
import { useCreateAccountStore } from '../../stores/createAccount'

const toast = inject('toast')
const route = useRouter()
const createAccount = useCreateAccountStore()

//Llama a la API para crear cuenta
const handleSubmit = async ({ password_confirm, ...formData }) => {    //Saco del objeto el password_confirm
    try {

        const { data } = await UserApi.create(formData) //Obtengo el json de respuesta

        toast.open({
            message: data.msg,
            type: 'success'
        })

        setTimeout(() => {
            route.push({ name: "login" })
        }, 1000);


    } catch (error) {
        console.log(error)
        toast.open({
            message: error.response.data.error,
            type: 'error'
        })
    }

}


//Permite visualizar el password
const handleIconClick = (node, e) => {
    node.props.prefixIcon = node.props.prefixIcon === 'eye' ? 'eyeClosed' : 'eye'
    node.props.type = node.props.type === 'password' ? 'text' : 'password'
}

</script>


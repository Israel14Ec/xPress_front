<template>
  <div class="w-[90%] lg:w-[50%] p-2 shadow-gray-300">
    <h1 class="text-center text-2xl mb-10 text-yellow-500 font-semibold uppercase">Inicia sesión en xPress</h1>
    <div class="mt-5 mx-10 md:mx-0 my-10">
      <div class="mx-auto w-full">
        <FormKit id="LoginForm" type="form" :actions="false" incomplete-message="Complete todos los campos"
          @submit="handleSubmit">

          <FormKit type="text" label-class="text-white" name="email" placeholder="Ingrese el correo"
            validation="required|email" :validation-messages="{
              required: 'El email es obligatorio',
              email: 'Email no valido'
            }" prefix-icon="email" autocomplete="current-email" />

          <FormKit type="password" label-class="text-white" name="password" placeholder="Ingresa la contraseña"
            validation="required" :validation-messages="{
              required: 'El password es obligatorio'
            }" autocomplete="current-password" prefix-icon="eyeClosed" @prefix-icon-click="handleIconClick" />

          <FormKit type="submit">
            Iniciar sesión
          </FormKit>

        </FormKit>

      </div>
      <div class=" flex flex-col md:flex-row justify-center items-center gap-3">
        <div>
          <RouterLink :to="{ name: 'createAccount' }">
            <p class="account-link">¿No tienes cuenta?</p>
          </RouterLink>
        </div>
        <div>
          <RouterLink :to="{ name: 'forgetPassword' }">
            <p class="account-link">¿Olvidaste tu contraseña?</p>
          </RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

//Logica del boton, llamo a la función de auth para guardar los datos obtenidos
const handleSubmit = (data) => {
  auth.authUser(data)
}

//Logica para visualizar el password
const handleIconClick = (node, e) => {
  node.props.prefixIcon = node.props.prefixIcon === 'eye' ? 'eyeClosed' : 'eye'
  node.props.type = node.props.type === 'password' ? 'text' : 'password'
}



</script>

<style scoped>
.formkit-suffix-icon:hover {
  color: var(--fk-color-primary);
}

.account-link {
  @apply text-yellow-500 hover:text-yellow-400 hover:font-extrabold text-sm;
}
</style>
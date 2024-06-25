<template>
    <div class="mt-5 mx-auto w-[90%] lg:w-[50%] shadow-gray-300">
        <div class="p-5">
            <div class="p-5 mx-auto rounded-lg">
                <div class="mb-5">
                    <p class="text-yellow-500 text-center font-bold text-lg uppercase">Recupera tu cuenta</p>
                </div>
                <div class="border-t-2 border-white"></div>
                <div class="my-3">
                    <p class="text-gray-900">Ingresa tu correo electrónico para buscar tu cuenta</p>
                </div>
           
                    <FormKit
                        type="text"
                        name="email"
                        placeholder="Ingrese el correo"
                        autocomplete="current-email"
                        v-model="emailForgot"
                    />
                    <p v-if="error" class="text-center text-gray-500 rounded-lg bg-red p-1 mb-2 font-semibold">
                        {{ message }}
                    </p>
                    
                    <div class="flex flex-row justify-end gap-3">

                        <RouterLink :to="{name: 'login'}" v-if="!loadSendEmail">
                            <ButtonBlack class="bg-gray-100 hover:bg-gray-300 text-gray-700">
                                <XMarkIcon />
                                <template #text>Cancelar</template>
                            </ButtonBlack>
                        </RouterLink>
                
                        <ButtonBlack class="bg-gray-800 hover:bg-gray-500 text-white"
                            @click="sendEmailHandler()"
                            >
                            <MagnifyingGlassIcon />
                            <template #text>Buscar</template>
                        </ButtonBlack>
                  
                    
                    </div>
                    
                    <div v-if="loadSendEmail">
                        <Spinner/>
                        <p class="text-center text-sm text-gray-50 font-bold tracking-wider">Enviando al correo</p>
                    </div>
                   
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import ButtonBlack from '../../components/ButtonBlack.vue';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '../../stores/user';
import Spinner from '../../components/Spinner.vue';

const user = useUserStore()
const { emailForgot, loadSendEmail } = storeToRefs(user)

const error = ref(false)
const message = ref('')

const sendEmailHandler = ()=> {
    //Verificar que hay un email
    if(!emailForgot.value){
        error.value = true
        message.value = 'No se ingreso un email'
        setTimeout(() => {
            error.value = false
        }, 3000);
        return
    }

    // Expresión regular para validar un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar si el valor ingresado coincide con el patrón de correo electrónico
    if (!emailRegex.test(emailForgot.value)) {
        error.value = true;
        message.value = 'El formato del email es inválido';
        setTimeout(() => {
            error.value = false
        }, 3000);
        return;
    }

    user.recoverPassword()
}

</script>

<template>
    <div class="mt-5 mx-auto">
           <div class="p-5">
               <div class=" max-w-[100%] md:max-w-[50%] px-16 py-5 mx-auto bg-gray-900 rounded-lg">
   
                   <div class="mb-5">
                       <p class="text-white font-semibold text-lg">Nueva contraseña</p>
                   </div>
                   <div class="border-t-2 border-white"></div>
                   <div class="my-3">
                       <p class="text-white">Ingresa tu nueva contraseña</p>
                   </div>
   
                   <FormKit 
                       type="password" 
                       name="password"
                       autocomplete="current-password" 
                       prefix-icon="eyeClosed"
                       @prefix-icon-click="handleIconClick" 
                       v-model="newPassword"
                   />
                   <p v-if="error" class="text-center text-gray-500 rounded-lg bg-red p-1 mb-2 font-semibold">
                       {{ message }}
                   </p>
                   <div class="flex flex-row justify-end gap-5">
                       <ButtonBlack class="bg-yellow-500 hover:bg-yellow-400 text-white"
                           @click="keepNewPass()"
                       >
                           <CheckCircleIcon />
                           <template #text>Guardar</template>
                       </ButtonBlack>    
                   </div>
            
               </div>
           </div>
       </div>
   </template>
   
   <script setup>
   
   import { onMounted, ref } from 'vue'
   import { useRoute } from 'vue-router'
   import { useUserStore } from '../../stores/user'
   import ButtonBlack from '../../components/ButtonBlack.vue';
   import { CheckCircleIcon } from '@heroicons/vue/24/solid'
   
   const route = useRoute()
   const user = useUserStore()
   const newPassword = ref('')
   const error = ref(false)
   const message = ref('');
   
   onMounted(() => {
       user.validateTokenPass(route.params.token)
   })
   
   const keepNewPass = () => {
   
       //Validar que la contraseña no esta vacia
       if(!newPassword.value) {
           error.value = true
           message.value = "Ingrese una contraseña "
           setTimeout(() => {
               error.value = false
           }, 3000);
           return
       }
   
       //Validar que la contraseña sea mayor a 8
       if(newPassword.value.length < 8) {
           error.value = true
           message.value = "La contraseña debe tener al menos 8 caracteres "
           setTimeout(() => {
               error.value = false
           }, 3000);
           return
       }
   
       user.resetPassword(route.params.token, newPassword.value)
       newPassword.value = ''
   }
   
   //Permite visualizar el password
   const handleIconClick = (node, e) => {
       node.props.prefixIcon = node.props.prefixIcon === 'eye' ? 'eyeClosed' : 'eye'
       node.props.type = node.props.type === 'password' ? 'text' : 'password'
   }
   
   
   </script>
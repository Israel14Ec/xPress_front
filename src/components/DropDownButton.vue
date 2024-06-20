<template>
    <div class="mt-1 mx-3 border-b-2">
        <div class="hover:bg-gray-500 rounded-xl p-1 text-gray-50"
        >
            <div @click="isOpen = !isOpen">
                <div class="flex flex-row "
                :class="{'text-gray-300': isOpen, ' text-gray-300': isSelect}"
                >
                    <div class="ml-2 w-5">
                        <slot></slot>
                    </div>
                    
                    <p class="ml-3 text-sm">
                        <slot  name="text"/>
                    </p>

                    <div class="ml-auto w-5">
                        <ChevronDownIcon/>
                    </div>
                </div>
            </div>
        </div>
      
        <div 
            v-if="isOpen"
            class="text-left ml-5 border-l-4 border-yellow-100" 
            
        >
        
            <slot name="option"/>
        </div>
    </div>
</template>

<script setup>
  
    import {ref} from 'vue'
    import { ChevronDownIcon } from "@heroicons/vue/24/solid";
    const isOpen = ref(false)

    defineProps({
        isSelect: {
            type: Boolean,
        },
    });

</script>

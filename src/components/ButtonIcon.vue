<template>
  <button class="inline-flex py-1 px-4 gap-1 rounded-lg text-white">
    <div class="w-5 my-auto">
        <slot>
        </slot>
    </div>
    <span> <slot name="text" /> </span>
  </button>
</template>



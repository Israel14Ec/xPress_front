//Diseño para los FormKit

import {generateClasses} from '@formkit/themes'

const config = {
    config: {
        classes: generateClasses({
            global: {
              wrapper: 'rounded-lg',
              fieldset: 'max-w-md border border-gray-400 px-2 pb-1',
              help: 'text-xs text-gray-500',
              inner:
                'bg-white formkit-disabled:bg-gray-700 formkit-disabled:cursor-not-allowed formkit-disabled:pointer-events-none',
              input:
              'focus:outline-none focus:ring-0 focus:shadow-none w-full',
              label: 'block font-bold font-medium text-md text-gray-700',
              legend: 'font-bold text-sm',
              loaderIcon: 'inline-flex items-center w-4 text-gray-600 animate-spin',
              message: 'text-red-500 text-xs text-center',
              messages: 'list-none p-0 mt-1 mb-0',
              outer: 'mb-4 formkit-disabled:opacity-50',
              prefixIcon:
                'w-10 flex self-stretch grow-0 shrink-0 rounded-tl rounded-bl border-r border-gray-400 bg-white bg-gradient-to-b from-transparent to-gray-200 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
              suffixIcon:
                'w-16 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            },
            
            submit: {
              input: '$reset flex justify-center bg-gray-800 mx-auto hover:bg-gray-500 rounded-lg font-bold text-white p-2 mt-5 w-full'
            },

            // Family styles apply to all inputs that share a common family
            'family:box': {
              decorator:
                'block relative h-5 w-5 mr-2 rounded bg-white bg-gradient-to-b from-transparent to-gray-200 ring-1 ring-gray-400 peer-checked:ring-yellow-500 text-transparent peer-checked:text-blue-500',
              decoratorIcon:
                'flex p-[3px] w-full h-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
              help: 'mb-2',
              input:
                'absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none peer w-full',
              inner: '$remove:formkit-disabled:bg-gray-200',
              label: '$reset text-xs text-gray-700 mt-1 select-none',
              wrapper: 'flex items-center mb-1',
            },
           
            'family:dropdown': {
              dropdownWrapper:
                'my-2 w-full shadow-lg rounded [&::-webkit-scrollbar]:hidden',
              emptyMessageInner:
                'flex items-center justify-center text-sm p-2 text-center w-full text-gray-500 [&>span]:mr-3 [&>span]:ml-0',
              inner:
                'relative bg-white flex ring-1 ring-gray-400 focus-within:ring-yellow-500focus-within:ring-2 rounded mb-2 formkit-disabled:focus-within:ring-gray-400 formkit-disabled:focus-within:ring-1 [&>span:first-child]:focus-within:text-blue-500',
              input: 'w-full px-3 py-2',
              listbox: 'bg-white shadow-lg rounded overflow-hidden',
              listboxButton: 'flex w-12 self-stretch justify-center mx-auto',
              listitem:
                'pl-7 relative hover:bg-gray-300 data-[is-active="true"]:bg-gray-300 aria-selected:bg-blue-600 aria-selected:text-white data-[is-active="true"]:aria-selected:bg-blue-600 data-[is-active="true"]:aria-selected:bg-blue-700',
              loaderIcon: 'ml-auto',
              loadMoreInner:
                'flex items-center justify-center text-sm p-2 text-center w-full text-blue-500 formkit-loading:text-gray-500 cursor-pointer [&>span]:mr-3 [&>span]:ml-0',
              option: 'p-2.5',
              optionLoading: 'pl-2.5 text-gray-400',
              placeholder: 'p-2.5 text-gray-400',
              selector:
                'flex mx-auto max-w-[100%]  justify-between items-center min-h-[2.625em] [&u] cursor-default mx-auto',
              selection: 'flex w-full ',
              selectedIcon: 'block absolute top-1/2 left-2 w-3 -translate-y-1/2',
              selectIcon:
                'flex box-content w-4 px-2 self-stretch grow-0 shrink-0 [&>svg]:w-[1em] cursor-pointer',
            },
            'family:text': {
              inner:
                'flex items-center max-w-[100%]  ring-1 ring-gray-400 focus-within:ring-yellow-500 focus-within:ring-2 [&>label:first-child]:focus-within:text-blue-500 rounded mb-1',
              input:
                'w-full px-3 py-2 border-none text-gray-700 placeholder-gray-400',
            },

          
            // Specific styles apply only to a given input type
            color: {
              inner:
                'flex max-w-[5.5em] w-full formkit-prefix-icon:max-w-[7.5em] formkit-suffix-icon:formkit-prefix-icon:max-w-[10em]',
              input:
                '$reset appearance-none w-full cursor-pointer border-none rounded p-0 m-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none',
              suffixIcon: 'min-w-[2.5em] pr-0 pl-0 m-auto',
            },
            file: {
              fileItem: 'flex items-center text-gray-800 mb-1 last:mb-0',
              fileItemIcon: 'w-4 mr-2 shrink-0',
              fileList:
                'shrink grow peer px-3 py-2 formkit-multiple:data-[has-multiple="true"]:mb-6',
              fileName: 'break-all grow text-ellipsis',
              fileRemove:
                'relative z-[2] ml-auto text-[0px] hover:text-red-500 pl-2 peer-data-[has-multiple=true]:text-sm peer-data-[has-multiple=true]:text-blue-500 peer-data-[has-multiple=true]:ml-3 peer-data-[has-multiple=true]:mb-2 formkit-multiple:bottom-[0.15em] formkit-multiple:pl-0 formkit-multiple:ml-0 formkit-multiple:left-[1em] formkit-multiple:formkit-prefix-icon:left-[3.75em]',
              fileRemoveIcon: 'block text-base w-3 relative z-[2]',
              inner:
                'relative max-w-md cursor-pointer formkit-multiple:[&>button]:absolute',
              input:
                'cursor-pointer text-transparent absolute top-0 right-0 left-0 bottom-0 opacity-0 z-[2]',
              noFiles: 'flex w-full items-center px-3 py-2 text-gray-400',
              noFilesIcon: 'w-4 mr-2',
            },
            radio: {
              decorator: 'rounded-full',
              decoratorIcon: 'w-5 p-[5px]',
            },
            range: {
              inner: '$reset flex items-center max-w-md',
              input: '$reset w-full mb-1 h-2 p-0 rounded-full',
              prefixIcon:
                '$reset mr-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
              suffixIcon:
                '$reset ml-1 flex self-stretch grow-0 shrink-0 [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            },
            select: {
              inner:
                'flex mx-auto max-w-[100%] relative items-center rounded mb-1 ring-1 ring-gray-400 focus-within:ring-yellow-500 focus-within:ring-2 [&>span:first-child]:focus-within:text-blue-500',
              input:
                'pl-3 pr-8 py-2 border-none text-base text-gray-700 placeholder-gray-400 formkit-multiple:p-0 data-[placeholder="true"]:text-gray-400 formkit-multiple:data-[placeholder="true"]:text-inherit',
              selectIcon:
                'flex p-[3px] shrink-0 w-5 mr-2 -ml-[1.5em] h-full pointer-events-none [&>svg]:w-[1em]',
              option: 'formkit-multiple:p-3 formkit-multiple:text-sm text-gray-700',
            },
            textarea: {
              inner:
                'flex rounded mb-1 ring-1 ring-gray-400 focus-within:ring-yellow-500 [&>label:first-child]:focus-within:text-blue-500',
              input:
                'block h-24 px-3 py-3 border-none text-base text-gray-700 placeholder-gray-400 focus:shadow-outline',
            },
          
           
        })
    }
}

export default config
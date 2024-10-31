import { h,render } from "vue"

import {Spin} from "@arco-design/web-vue"

function loadIng(){

    const loads=  document.getElementsByClassName("global-loading")

    for (let index = 0; index < loads.length; index++) {
        const element = loads[index];
        element.remove()
    }

    const vnode=h(Spin,{
        loading:true,
        dot:true,
        size:12
    })

    const wrap=document.createElement("div")

    document.body.appendChild(wrap)
    
    wrap.classList.add("global-loading")

    render(vnode,wrap)

    return {
        close(){
            wrap.remove()
        }
    }
}

export {loadIng}
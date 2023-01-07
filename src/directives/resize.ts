import {Directive} from "vue";

export default <Directive>{
    mounted: (el, binding) => {
        const handle:HTMLElement = el.querySelector(binding.value)
        handle.addEventListener('mousedown', event => {
            const startWidth = el.offsetWidth
            const startX = event.clientX

            const onMouseMove = (event:MouseEvent) => {
                const dx = startX - event.clientX
                el.style.width = startWidth + dx + 'px'
            }
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        })
    }
}

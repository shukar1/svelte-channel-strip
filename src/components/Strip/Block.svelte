<svelte:options immutable/>
<script lang='ts'>
  import { press, pressing } from '../../directives';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  export let event;
  export let longPressTimeout = 250;
  let textWidth;
  let annotationPosition;
  $: scale = event?.pressing || event?.gripping;
  $: interacting = event?.dragging || event?.gripping;
  $: bg = event?.meta?.backgroundColor || 'gray';
  $: level = interacting ? 400 : event?.hovering ? 300 : 200;
  $: style = `left: ${event?.left}px; width: ${event?.width}px; margin: ${event?.gap}px 0;`;
  $: {
    if (event?.offsetEnd) {
      annotationPosition = `right: -${textWidth + 8}px`;
    } else if (event?.left) {
      annotationPosition = `left: -${textWidth + 8}px`;
    } else {
      annotationPosition = `right: 8px`;
    }
  }
  $: annotationStyle = `width: max-content; font-size: 0.75rem; ${annotationPosition}`;
  $: handleColor = event?.meta?.handleColor || 'gray';
</script>

<div
	id='event-{event.id}'
	{style}
	on:mousedown={e => dispatch('containerMouseDown', e)}
	on:mouseenter={e => dispatch('containerMouseEnter', e)}
	on:mouseleave={e => dispatch('containerMouseLeave', e)}
	on:mousemove={e => dispatch('containerMouseMove', e)}
	class:rounded-l={event.left}
	class:rounded-r={event.earlyEnd}
	class:pr-2={event.hoverRight}
	class:pl-2={event.hoverLeft}
	class:shadow-sm={event.hovering}
	class:scale-y-95={scale}
	class='flex items-center relative select-none
	transition-all duration-75 ease-in-out transform
	bg-{handleColor}-400
	cursor-ew-resize'
>
	<div
		style='height: {event?.height}px;'
		use:press={longPressTimeout}
		use:pressing
		on:pressing
		on:stoppedpressing
		on:longpress|preventDefault
		on:normalpress|preventDefault
		on:contextmenu|preventDefault
		on:mousedown|preventDefault
		class:cursor-grabbing={event.gripping}
		class:cursor-pointer={event.pressing}
		class='flex-1 cursor-grab flex z-10 bg-{bg}-{level} rounded'
	>
	</div>
	<div
		class='absolute z-20'
		bind:clientWidth={textWidth}
		style={annotationStyle}
	><span>{event.title}</span>
		{#if event.subtitle}
			<small>{event.subtitle}</small>
		{/if}
	</div>
</div>

<style>
    div:first-child {
        align-items: center;
    }
</style>

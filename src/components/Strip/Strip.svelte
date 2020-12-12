<script lang='ts'>
  import Header from './Header.svelte';
  import Block from './Block.svelte';
  import { createEventDispatcher } from 'svelte';
  import { get, writable } from 'svelte/store';
  import Columns from './Columns.svelte';
  
  export let cols = [];
  export let events = [];
  export let longPressTimeout = 250;
  export let blockHeight = 16;
  export let blockGap = 8;
  const dispatch = createEventDispatcher();
  let state = writable({});
  let headerHeight;
  let clientWidth;
  let hoveredCol = 0;
  let focusedId = null;
  let originalMouseX = 0;
  let originalMouseY = 0;
  $: gridCols = cols[0].children ? cols.reduce((accum, v) => {
    return v.children.length + accum;
  }, 0) : cols.length;
  $: colWidth = clientWidth / gridCols;
  $: focused = events.find(e => e.id === focusedId);
  $: index = focusedId && events.findIndex(e => e.id === focusedId);
  $: blockSize = blockHeight + blockGap;
  $: events$ = events.map(e => {
    let left = (e.start - 1) * colWidth;
    let width = (Math.min(e.end, gridCols) + 1 - e.start) * colWidth;
    return {
      ...e,
      left,
      width,
      height: blockHeight,
      gap: blockGap,
      offsetEnd: clientWidth - left - width > e.title.length * 7 + 16,
      earlyEnd: e.end < gridCols,
      ...get(state)[e.id]
    };
  });
  
  function updateEvent(id, data) {
    state.update(s => {
      s[id] = { ...s[id], ...data };
      return s;
    });
  }
  
  function onContainerMouseMove(event, mouseEvent) {
    let rect = mouseEvent.target.getBoundingClientRect();
    let left = rect.x;
    let right = left + rect.width;
    let hoverLeft = mouseEvent.pageX - left <= 30;
    let hoverRight = right - mouseEvent.pageX <= 30;
    updateEvent(event.id, { hoverLeft, hoverRight });
  }
  
  function onContainerMouseLeave(event) {
    if (!get(state)[event.id]?.dragging) {
      updateEvent(event.id, { hovering: false, hoverLeft: false, hoverRight: false });
    }
  }
  
  function onContainerMouseEnter(event) {
    updateEvent(event.id, { hovering: true });
  }
  
  function onContainerMouseDown(event, e) {
    if (get(state)[event.id]?.gripping) return;
    focusedId = event.id;
    updateEvent(event.id, { dragging: true });
    originalMouseX = e.pageX;
    let fn = onResizeAction.bind(this, get(state)[event.id].hoverRight ? 'right' : 'left');
    let close = function () {
      updateEvent(event.id, { dragging: false });
      window.removeEventListener('mousemove', fn);
      window.removeEventListener('mouseup', close);
      focusedId = null;
    };
    window.addEventListener('mousemove', fn);
    window.addEventListener('mouseup', close);
  }
  
  function onResizeAction(handle, event) {
    let diff = event.pageX - originalMouseX;
    if (Math.abs(diff / colWidth) >= 0.50) {
      if (handle === 'right') {
        if (diff > 0) {
          if (focused.end === gridCols) {
            return;
          }
          dispatch('positionUpdate', {
            id: focused.id,
            end: focused.end + 1
          });
          originalMouseX += colWidth;
        } else {
          if (focused.end === focused.start) {
            return;
          }
          dispatch('positionUpdate', {
            id: focused.id,
            end: focused.end - 1
          });
          originalMouseX -= colWidth;
        }
      } else { // left handle
        if (diff > 0) { // --->
          if (focused.start === focused.end) {
            return;
          }
          dispatch('positionUpdate', {
            id: focused.id,
            start: focused.start + 1
          });
          originalMouseX += colWidth;
        } else { // <---
          if (focused.start === 1) {
            return;
          }
          dispatch('positionUpdate', {
            id: focused.id,
            start: focused.start - 1
          });
          originalMouseX -= colWidth;
        }
      }
    }
  }
  
  function onGripStart(event, gripEvent) {
    if (gripEvent.button) return;
    updateEvent(event.id, { gripping: true });
    originalMouseX = gripEvent.pageX;
    originalMouseY = gripEvent.pageY;
    focusedId = event.id;
    window.addEventListener('mousemove', onGripMouseMove);
    window.addEventListener('mouseup', onGripStop);
  }
  
  function onGripStop() {
    updateEvent(focusedId, { gripping: false, moved: false });
    window.removeEventListener('mousemove', onGripMouseMove);
    window.removeEventListener('mouseup', onGripStop);
    focusedId = null;
  }
  
  function onGripMouseMove(event) {
    if (!get(state)[event.id]?.moved) {
      updateEvent(focusedId, { moved: true });
    }
    let verticalDiff = event.pageY - originalMouseY;
    let horizontalDiff = event.pageX - originalMouseX;
    // VERTICAL
    if (Math.abs(verticalDiff / blockSize) >= .5) {
      if (verticalDiff > 0) { // downward
        if (index + 1 < events.length) {
          dispatch('swap', [ focusedId, events[index + 1].id ]);
          originalMouseY += blockSize;
        }
      } else { // upward
        if (index > 0) {
          dispatch('swap', [ focusedId, events[index - 1].id ]);
          originalMouseY -= blockSize;
        }
      }
    }
    
    if (Math.abs(horizontalDiff / colWidth) >= .5) {
      if (horizontalDiff > 0) { // grip right
        if (focused.end === gridCols) {
          return;
        }
        dispatch('positionUpdate', {
          id: focused.id,
          start: focused.start + 1,
          end: focused.end + 1
        });
        originalMouseX += colWidth;
      } else {
        if (focused.start === 1) {
          return;
        }
        dispatch('positionUpdate', {
          id: focused.id,
          start: focused.start - 1,
          end: focused.end - 1
        });
        originalMouseX -= colWidth;
      }
    }
  }
  
  function onLongPress(event, mouseEvent) {
    if (!get(state)[event.id]?.moved) {
      onGripStop();
      dispatch('longpress', {
        id: event.id,
        source: mouseEvent
      });
    }
  }

</script>

<div class='overflow-hidden relative h-full' bind:clientWidth>
	<div bind:clientHeight={headerHeight} class='shadow'>
		<Header {cols}/>
	</div>
	<Columns colNum={gridCols} top={headerHeight}/>
	<div class='overflow-auto absolute left-0' style='right: -15px; height: calc(100% - {headerHeight}px);'>
		{#each events$ as event, index (event.id)}
			<Block
				{longPressTimeout}
				event={{...event, ...$state[event.id]}}
				on:containerMouseDown={e => onContainerMouseDown(event, e.detail)}
				on:containerMouseMove={e => onContainerMouseMove(event, e.detail)}
				on:containerMouseEnter={e => onContainerMouseEnter(event, e.detail)}
				on:containerMouseLeave={e => onContainerMouseLeave(event, e.detail)}
				on:pressing={_ => updateEvent(event.id, {pressing: true})}
				on:stoppedpressing={_ => updateEvent(event.id, {pressing: false})}
				on:longpress={onLongPress.bind(this, event)}
				on:normalpress={e => dispatch('normalpress', {id: event.id, source: e.detail})}
				on:contextmenu={e => dispatch('ctx', {id: event.id, source: e.detail})}
				on:mousedown={onGripStart.bind(this, event)}
			/>
		{/each}
		<div on:mousemove={e => hoveredCol = Math.ceil(e.offsetX / colWidth)} class='h-12'></div>
	</div>
</div>

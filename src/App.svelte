<script lang='ts'>
  import Tailwindcss from './Tailwindcss.svelte';
  import Strip from './components/Strip/Strip.svelte';
  import Github from './components/Github.svelte';
  
  let cols = [
    {
      title: 'A',
      children: [
        {
          title: 'a'
        },
        {
          title: 'b'
        },
        {
          title: 'c'
        }
      ]
    },
    {
      title: 'B',
      children: [
        {
          title: 'a'
        },
        {
          title: 'b'
        },
        {
          title: 'c'
        },
        {
          title: 'd'
        }
      ]
    }
  ];
  let events = Array.from({ length: 60 }).map((_, i) => {
    let start = Math.round(Math.random() * 3) + 1;
    return {
      id: i + 1,
      title: 'title',
      subtitle: 'subtitle',
      start,
      end: Math.round(Math.random() * 3) + start,
      meta: {
        backgroundColor: 'pink',
        handleColor: Math.random() > .5 ? 'red' : 'blue'
      }
    };
  });
  
  function onPositionUpdate(event) {
    let { id, ...rest } = event.detail;
    events = events.map(e => {
      return e.id === id ? {
        ...e,
        ...rest
      } : e;
    });
  }
  
  function onSwap(event) {
    let [ a, b ] = event.detail;
    let values = events.slice(0);
    let i = values.findIndex(m => m.id === a);
    let j = values.findIndex(m => m.id === b);
    let tmp = values[i];
    values[i] = values[j];
    values[j] = tmp;
    events = values;
  }
  
  function onNormalPress(event) {
    console.log(event);
  }
  
  function onLongPress(event) {
    console.log(event);
  }
  
  function onCtxPress(event) {
    console.log(event);
  }
</script>
<Tailwindcss/>

<main>
	<Strip
		{cols} {events}
		on:positionUpdate={onPositionUpdate}
		on:swap={onSwap}
		on:longpress={onLongPress}
		on:normalpress={onNormalPress}
		on:ctx={onCtxPress}
	
	/>
	<Github href='https://github.com/shukar1/svelte-channel-strip'/>
	<!--	on:pendingEvent={onPendingEvent}-->
</main>
<style global>
    html, body, main {
        @apply h-full;
    }
</style>

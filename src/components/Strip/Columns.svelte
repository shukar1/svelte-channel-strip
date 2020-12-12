<script>
	export let top;
	export let colNum;
</script>

<div class='flex absolute bottom-0 left-0 right-0' style='top: {top}px'>
	{#each { length: colNum } as col, index (index)}
		<div class:border-r={index + 1 < colNum} class='flex-1'></div>
	{/each}
</div>

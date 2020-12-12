<script lang='ts'>
  export let cols: any[] = [];
</script>

<div class='flex w-full'>
	{#each cols as { title, children }, index (index)}
		<div class:border-r={index + 1 < cols.length} style='flex: {children?.length || 1}' class='text-center'>
			<div class='border-b'>{title}</div>
			{#if children}
				<svelte:self cols={children}/>
			{/if}
		</div>
	{/each}
</div>

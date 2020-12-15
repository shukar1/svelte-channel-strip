<script>
  import githubIcon from '../icons/github-brands.svg';

  export let href = '';
</script>

<figure class='icon'>
	<a {href} target='_blank'>
		<img src={githubIcon} alt='Github' height='50px' width='50px'>
	</a>
</figure>


<style>
    figure {
        position: fixed;
        top: 0;
        right: 0;
        margin: 1rem;
    }
</style>

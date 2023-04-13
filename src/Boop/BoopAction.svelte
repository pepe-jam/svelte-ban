<script lang="ts">
	import boop from './boop.js';
	export let boopParams: Map<string, number>;
	let isBooped = false;
	
	// Is there a more Svelte-y way to do this?
	function setIsBooped(val: boolean) {
		isBooped = val;
	}
	
	function triggerBoop() {
		isBooped = true;
	}
</script>

<!-- trigger onclick so demo works on mobile -->
<span on:mouseenter={triggerBoop} on:click={triggerBoop} on:keydown={triggerBoop} use:boop={{isBooped, ...boopParams, setter: setIsBooped}}>
	<slot/>
</span>
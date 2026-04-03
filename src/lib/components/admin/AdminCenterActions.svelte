<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<nav class="flex items-center justify-center gap-2">
	<button type="button" class="btn btn-outline btn-sm" onclick={() => goto(resolve('/dashboard/admin/proprios'))}>Tous les proprios</button>
	<button type="button" class="btn btn-outline btn-sm" onclick={() => goto(resolve('/dashboard/admin/performance'))}>Perf & stats</button>
	<button type="button" class="btn btn-outline btn-sm" onclick={() => goto(resolve('/dashboard/admin/audit'))}>Journal d'audit</button>
</nav>

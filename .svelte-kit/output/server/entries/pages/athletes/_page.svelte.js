import { S as escape_html, n as derived, o as stringify, r as ensure_array_like, x as attr } from "../../../chunks/server.js";
//#region src/routes/athletes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {{ data: { athletes: any[] } }} */
		let { data } = $$props;
		let searchQuery = "";
		let filteredAthletes = derived(() => (data.athletes ?? []).filter((athlete) => athlete.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || athlete.club?.toLowerCase().includes(searchQuery.toLowerCase())));
		$$renderer.push(`<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop"><div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md"><div><h1 class="font-headline-lg text-headline-lg text-white uppercase italic">Athlete Directory</h1> <p class="font-body-md text-on-surface-variant mt-2">Browse the full league roster of registered competitors.</p></div> <span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">${escape_html(filteredAthletes().length)} ATHLETES</span></div> <div class="mb-stack-lg max-w-md"><label for="search" class="sr-only">Search athletes</label> <input id="search" type="text"${attr("value", searchQuery)} placeholder="Search by competitor name or club..." class="w-full bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm focus:border-primary outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/50"/></div> `);
		if (filteredAthletes().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<ul role="list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
			const each_array = ensure_array_like(filteredAthletes());
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let athlete = each_array[index];
				$$renderer.push(`<li><a${attr("href", `/athletes/${stringify(athlete.profile_id)}`)} class="bg-surface-container-high group hover:bg-surface-variant transition-all block h-full"><div class="p-stack-lg flex flex-col h-full"><div class="flex items-center gap-stack-md"><div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0 group-hover:border-primary transition-colors">`);
				if (athlete.avatar_url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", athlete.avatar_url)} alt="" class="w-full h-full object-cover"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant"><svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="min-w-0 flex-1"><h3 class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors truncate">${escape_html(athlete.full_name)}</h3> <p class="font-body-md text-on-surface-variant truncate mt-stack-sm">${escape_html(athlete.club || "Independent Athlete")}</p></div></div> <div class="flex items-center justify-between gap-stack-md mt-stack-md pt-stack-md border-t border-white/5 mt-auto"><span class="font-label-caps text-label-caps bg-surface-variant text-on-surface-variant px-2 py-1 shrink-0">${escape_html(athlete.nationality || "???")}</span> <div class="flex items-baseline gap-stack-sm shrink-0"><span class="font-stats-number text-stats-number text-secondary-fixed">${escape_html(athlete.total_points ?? 0)}</span> <span class="font-label-caps text-[10px] text-on-surface-variant">PTS</span></div></div></div></a></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-margin-desktop bg-surface-container-low border border-white/5"><p class="font-body-md text-on-surface-variant">No competitors match your active search terms.</p></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };

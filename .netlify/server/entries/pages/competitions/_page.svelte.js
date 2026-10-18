import "../../../chunks/index-server.js";
import { S as escape_html, o as stringify, r as ensure_array_like, s as unsubscribe_stores, t as attr_class, x as attr } from "../../../chunks/server.js";
import "../../../chunks/navigation.js";
import { t as formatCompetitionDate } from "../../../chunks/ui.js";
//#region src/routes/competitions/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { data } = $$props;
		let search = "";
		let status = "all";
		/** @param {string} status */
		function statusLabel(status) {
			switch (status) {
				case "open": return "OPEN";
				case "upcoming": return "UPCOMING";
				case "closed": return "CLOSED";
				case "completed": return "COMPLETED";
				default: return "CLOSED";
			}
		}
		/** @param {string} status */
		function statusColor(status) {
			switch (status) {
				case "open": return "bg-secondary-fixed text-on-secondary";
				case "upcoming": return "bg-primary text-on-primary";
				case "closed": return "bg-surface-variant text-on-surface-variant";
				case "completed": return "bg-surface-container text-on-surface-variant";
				default: return "bg-surface-variant text-on-surface-variant";
			}
		}
		$$renderer.push(`<section${attr_class(`relative bg-background overflow-hidden transition-all duration-1000 opacity-0`)}><div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop"><div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md"><div><h1 class="font-headline-lg text-headline-lg text-white uppercase italic">League Competitions</h1> <p class="font-body-md text-on-surface-variant mt-2">Find and register for upcoming athletic events.</p></div></div> <form class="mb-stack-lg flex flex-col sm:flex-row gap-gutter items-end"><div class="w-full sm:w-1/3 flex flex-col gap-stack-sm"><label for="search" class="font-label-caps text-label-caps text-primary">Search by Location</label> <input id="search" type="text"${attr("value", search)} placeholder="E.g. Cairo, Giza..." class="w-full bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm focus:border-primary outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/50"/></div> <div class="w-full sm:w-1/4 flex flex-col gap-stack-sm"><label for="status" class="font-label-caps text-label-caps text-primary">Event Status</label> `);
		$$renderer.select({
			id: "status",
			value: status,
			class: "w-full bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm focus:border-primary outline-none text-on-surface font-body-md"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Events`);
			});
			$$renderer.option({ value: "upcoming" }, ($$renderer) => {
				$$renderer.push(`Upcoming`);
			});
			$$renderer.option({ value: "open" }, ($$renderer) => {
				$$renderer.push(`Open to Register`);
			});
			$$renderer.option({ value: "closed" }, ($$renderer) => {
				$$renderer.push(`Registration Closed`);
			});
			$$renderer.option({ value: "completed" }, ($$renderer) => {
				$$renderer.push(`Completed`);
			});
		});
		$$renderer.push(`</div> <button type="submit" class="bg-primary hover:bg-primary/90 text-on-primary px-8 py-stack-sm font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95">FILTER</button></form> `);
		if ((data.competitions ?? []).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
			const each_array = ensure_array_like(data.competitions ?? []);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let competition = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/competitions/${stringify(competition.id)}`)} class="bg-surface-container-high group hover:bg-surface-variant transition-all block"><div class="h-48 relative overflow-hidden">`);
				if (competition.image_url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", competition.image_url)}${attr("alt", competition.title)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container-highest flex items-center justify-center transition-transform duration-500 group-hover:scale-110"><span class="material-symbols-outlined text-6xl text-outline">stadium</span></div>`);
				}
				$$renderer.push(`<!--]--> <div${attr_class(`absolute top-4 left-4 ${stringify(statusColor(competition.status))} px-3 py-1 font-label-caps text-label-caps`)}>${escape_html(statusLabel(competition.status))}</div> <div class="absolute top-4 right-4 bg-surface-container/80 backdrop-blur-sm px-3 py-1 font-label-caps text-[10px] text-on-surface">${escape_html(formatCompetitionDate(competition.event_date))}</div></div> <div class="p-stack-lg space-y-stack-sm"><h4 class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors">${escape_html(competition.title)}</h4> <p class="font-body-md text-on-surface-variant">${escape_html(competition.location)}</p> <div class="pt-stack-md">`);
				if (competition.status === "open") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="block w-full border border-primary text-primary py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all text-center">REGISTER ($${escape_html(competition.ticket_price)})</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="block w-full border border-outline text-outline py-stack-sm font-label-caps text-label-caps text-center">VIEW DETAILS</span>`);
				}
				$$renderer.push(`<!--]--></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-margin-desktop bg-surface-container-low border border-white/5"><p class="font-body-md text-on-surface-variant mb-stack-md">No events match your filters.</p> <button type="button" class="bg-primary hover:bg-primary/90 text-on-primary px-8 py-stack-sm font-label-caps text-label-caps transition-all">CLEAR FILTERS</button></div>`);
		}
		$$renderer.push(`<!--]--></div></section>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };

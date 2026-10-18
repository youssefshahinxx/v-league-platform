import "../../../../chunks/index-server.js";
import { S as escape_html, n as derived, o as stringify, r as ensure_array_like, s as unsubscribe_stores, t as attr_class, x as attr } from "../../../../chunks/server.js";
import "../../../../chunks/supabase.js";
import { n as formatCompetitionDateLong } from "../../../../chunks/ui.js";
//#region src/lib/components/MediaSlideshow.svelte
function MediaSlideshow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {{ media: Array<{url: string, type?: string}>, heroImage?: string }} */
		let { media = [], heroImage = "" } = $$props;
		let slides = derived(() => media.length > 0 ? media : heroImage ? [{
			url: heroImage,
			type: "image"
		}] : []);
		let currentIndex = 0;
		/** @param {string} url
		*  @param {string} [type] */
		function isVideo(url, type) {
			if (type === "video") return true;
			return /\.(mp4|webm|ogg|mov)$/i.test(url);
		}
		if (slides().length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative w-full overflow-hidden bg-zinc-900">`);
			if (isVideo(slides()[currentIndex].url, slides()[currentIndex].type)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<video${attr("src", slides()[currentIndex].url)} controls="" class="w-full h-full object-contain max-h-[400px]"></video>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<img${attr("src", slides()[currentIndex].url)}${attr("alt", `Slide ${stringify(1)}`)} class="w-full h-full object-contain max-h-[400px]"/>`);
			}
			$$renderer.push(`<!--]--> `);
			if (slides().length > 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition" aria-label="Previous slide"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path></svg></button> <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition" aria-label="Next slide"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path></svg></button> <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"><!--[-->`);
				const each_array = ensure_array_like(slides());
				for (let i = 0, $$length = each_array.length; i < $$length; i++) {
					each_array[i];
					$$renderer.push(`<button type="button"${attr_class(`w-2.5 h-2.5 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/40"}`)}${attr("aria-label", `Go to slide ${stringify(i + 1)}`)}></button>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/CompetitionEventTable.svelte
function CompetitionEventTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {Array<{official_rank: number, avatar_url: string | null, full_name: string, performance: number | string | null, points: number | null, profile_id: string}>} */
		let rows = [];
		let { competitionEventId, title = "" } = $$props;
		/** @param {number | string | null} value */
		function formatPerformance(value) {
			if (value === null || value === void 0 || value === "") return "---";
			if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
			return String(value);
		}
		$$renderer.push(`<div class="bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div> <div class="flex justify-between items-end mb-stack-lg gap-stack-md"><h3 class="font-headline-lg text-headline-lg text-white uppercase italic">${escape_html(title)}</h3> <span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">EVENT RESULTS</span></div> `);
		if (rows.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-white/10"><th class="py-stack-sm font-label-caps text-label-caps text-primary">RANK</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">ATHLETE</th><th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">PERFORMANCE</th><th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">PTS</th></tr></thead><tbody class="divide-y divide-white/5"><!--[-->`);
			const each_array = ensure_array_like(rows);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let row = each_array[index];
				$$renderer.push(`<tr class="group/row hover:bg-white/5 transition-colors cursor-pointer"><td${attr_class(`py-stack-md font-stats-number text-stats-number ${index === 0 ? "text-secondary-fixed" : "text-on-surface-variant"} italic`)}>${escape_html(String(index + 1).padStart(2, "0"))}</td><td class="py-stack-md flex items-center gap-stack-md"><div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">`);
				if (row.avatar_url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", row.avatar_url)} alt="" class="w-full h-full object-cover"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg></div>`);
				}
				$$renderer.push(`<!--]--></div> <span class="font-headline-md text-headline-md text-white uppercase">${escape_html(row.full_name)}</span></td><td class="py-stack-md text-right font-body-lg text-on-surface">${escape_html(formatPerformance(row.performance))}</td><td class="py-stack-md text-right font-stats-number text-stats-number text-white">${escape_html(row.points ?? "---")}</td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-12 text-on-surface-variant font-body-md">No results recorded for this event yet.</div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/routes/competitions/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		/** @type {{ data: { competition: any, competitionEvents: Array<any>, userRegistrations: Array<any>, userHasRegistered: boolean, isLoggedIn: boolean } }} */
		let { data } = $$props;
		const registeredEventIds = derived(() => new Set((data.userRegistrations ?? []).map((registration) => registration.competition_event_id)));
		let isConfirming = false;
		/** @type {string[]} */
		let selectedEventIds = [];
		const selectableEvents = derived(() => (data.competitionEvents ?? []).filter((event) => event.status === "scheduled" && event.registration_open !== false && !registeredEventIds().has(event.id)));
		const totalCents = derived(() => selectableEvents().reduce((sum, event) => selectedEventIds.includes(event.id) ? sum + Math.round(Number(event.price ?? 0) * 100) : sum, 0));
		const totalEgp = derived(() => (totalCents() / 100).toFixed(2));
		/** @param {string} price */
		function formatPrice(price) {
			return `${Number(price ?? 0).toFixed(2)} EGP`;
		}
		/** @param {string} status */
		function statusBadge(status) {
			switch (status) {
				case "open": return {
					label: "OPEN",
					class: "bg-secondary-fixed text-on-secondary"
				};
				case "upcoming": return {
					label: "UPCOMING",
					class: "bg-primary text-on-primary"
				};
				case "closed": return {
					label: "CLOSED",
					class: "bg-surface-variant text-on-surface-variant"
				};
				case "completed": return {
					label: "COMPLETED",
					class: "bg-surface-container text-on-surface-variant"
				};
				default: return {
					label: "CLOSED",
					class: "bg-surface-variant text-on-surface-variant"
				};
			}
		}
		/** @param {string | null | undefined} status */
		function eventStatusBadge(status) {
			switch (status) {
				case "live": return {
					label: "LIVE",
					class: "bg-primary text-on-primary"
				};
				case "completed": return {
					label: "COMPLETED",
					class: "bg-secondary-fixed text-on-secondary"
				};
				case "canceled": return {
					label: "CANCELED",
					class: "bg-surface-container text-on-surface-variant"
				};
				case "scheduled": return {
					label: "SCHEDULED",
					class: "bg-surface-variant text-on-surface-variant"
				};
				default: return {
					label: (status ?? "---").toUpperCase(),
					class: "bg-surface-variant text-on-surface-variant"
				};
			}
		}
		/** @param {string | null | undefined} dateString */
		function formatSchedule(dateString) {
			if (!dateString) return "TBA";
			return new Date(dateString).toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit"
			});
		}
		$$renderer.push(`<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop"><div class="mb-stack-lg"><a href="/competitions" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2"><span class="material-symbols-outlined">arrow_back</span> Back to all competitions</a></div> `);
		if (data.competition) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start"><div class="lg:col-span-2 bg-surface-container-high p-stack-lg space-y-stack-lg"><div class="-m-stack-lg mb-0">`);
			MediaSlideshow($$renderer, {
				media: data.competition.media ?? [],
				heroImage: data.competition.image_url ?? ""
			});
			$$renderer.push(`<!----></div> <div><div class="flex items-center gap-stack-md mb-stack-sm"><span${attr_class(`${stringify(statusBadge(data.competition.status).class)} px-3 py-1 font-label-caps text-label-caps`)}>${escape_html(statusBadge(data.competition.status).label)}</span> <span class="font-body-md text-on-surface-variant">${escape_html(formatCompetitionDateLong(data.competition.event_date))}</span></div> <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">${escape_html(data.competition.title)}</h1> <p class="font-body-lg text-on-surface-variant mt-stack-sm">${escape_html(data.competition.location)}</p></div> <div class="border-t border-white/5 pt-stack-lg"><h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">About The Competition</h3> <p class="font-body-md text-on-surface-variant leading-relaxed">${escape_html(data.competition.description ?? "No specific technical rulebooks or descriptions published for this event yet.")}</p></div></div> <div class="lg:col-span-1 bg-surface-container-low p-stack-lg space-y-stack-md lg:sticky lg:top-24"><div><h3 class="font-headline-md text-headline-md text-white uppercase">Entry</h3> <p class="font-body-md text-on-surface-variant mt-stack-sm">Select your events and secure your slot instantly.</p></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.competition.status === "completed") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">EVENT COMPLETED</div>`);
			} else if (data.competition.status === "closed") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">REGISTRATION CLOSED</div>`);
			} else if ((data.competitionEvents ?? []).length === 0) {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<p class="font-body-md text-on-surface-variant">No events are scheduled for this competition yet.</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="border-t border-white/5 pt-stack-md space-y-stack-sm"><span class="font-label-caps text-label-caps text-on-surface-variant">SELECT EVENTS</span> <!--[-->`);
				const each_array = ensure_array_like(data.competitionEvents ?? []);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let event = each_array[$$index];
					if (registeredEventIds().has(event.id)) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex items-center justify-between gap-stack-md p-stack-sm bg-surface-container/60 border border-white/5 opacity-70"><span class="font-body-md text-on-surface-variant truncate">${escape_html(event.name)}</span> <span class="font-label-caps text-label-caps text-secondary-fixed shrink-0">REGISTERED</span></div>`);
					} else if (event.status === "scheduled" && event.registration_open !== false) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<button type="button"${attr("disabled", isConfirming, true)}${attr_class(`w-full flex items-center justify-between gap-stack-md p-stack-sm border transition-colors text-left cursor-pointer disabled:opacity-50 ${selectedEventIds.includes(event.id) ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/25"}`)}><span class="flex items-center gap-stack-md min-w-0"><span${attr_class(`w-4 h-4 flex-shrink-0 border flex items-center justify-center ${selectedEventIds.includes(event.id) ? "border-primary bg-primary" : "border-white/30"}`)}>`);
						if (selectedEventIds.includes(event.id)) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<svg class="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></span> <span class="font-body-md text-white truncate">${escape_html(event.name)}</span></span> <span class="font-body-md text-on-surface-variant shrink-0">${escape_html(formatPrice(event.price))}</span></button>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]--></div> <div class="border-t border-white/5 pt-stack-md flex items-baseline justify-between"><span class="font-label-caps text-label-caps text-on-surface-variant">Total</span> <span class="font-stats-number text-stats-number text-white">${escape_html(totalEgp())} EGP</span></div> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<button type="button"${attr("disabled", selectedEventIds.length === 0, true)} class="w-full text-center bg-primary hover:bg-primary/90 text-on-primary px-stack-md py-stack-sm font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer">${escape_html(`PAY ${totalEgp()} EGP`)}</button>`);
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div></div> `);
			if ((data.competitionEvents ?? []).length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="mt-margin-desktop space-y-stack-lg"><div class="bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden"><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div> <div class="flex justify-between items-end mb-stack-lg gap-stack-md"><h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Competition Event Statistics</h2> <span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">PROGRAM</span></div> <div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-white/10"><th class="py-stack-sm font-label-caps text-label-caps text-primary">NAME</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">GENDER</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">AGE CATEGORY</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">ROUND</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">STATUS</th><th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">SCHEDULE</th></tr></thead><tbody class="divide-y divide-white/5"><!--[-->`);
				const each_array_1 = ensure_array_like(data.competitionEvents ?? []);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let event = each_array_1[$$index_1];
					$$renderer.push(`<tr class="group/row hover:bg-white/5 transition-colors"><td class="py-stack-md font-headline-md italic text-headline-md text-white uppercase hover:text-primary transition-colors">${escape_html(event.name)}</td><td class="py-stack-md font-label-caps uppercase text-on-surface-variant">${escape_html(event.gender ?? "---")}</td><td class="py-stack-md font-label-caps uppercase text-on-surface-variant">${escape_html(event.age_category ?? "---")}</td><td class="py-stack-md font-label-caps uppercase text-on-surface-variant">${escape_html(event.round_type ?? "---")}</td><td class="py-stack-md"><span${attr_class(`${stringify(eventStatusBadge(event.status).class)} px-3 py-1 font-label-caps text-label-caps`)}>${escape_html(eventStatusBadge(event.status).label)}</span></td><td class="py-stack-md text-sm text-right font-body-md text-on-surface">${escape_html(formatSchedule(event.scheduled_at))}</td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></div> <!--[-->`);
				const each_array_2 = ensure_array_like(data.competitionEvents ?? []);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let event = each_array_2[$$index_2];
					$$renderer.push(`<div${attr("id", `event-${stringify(event.id)}`)} class="scroll-mt-32">`);
					CompetitionEventTable($$renderer, {
						competitionEventId: event.id,
						title: event.name
					});
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-margin-desktop bg-surface-container-low border border-white/5"><p class="font-body-md text-on-surface-variant">This event listing may have been archived or removed from the league records.</p></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };

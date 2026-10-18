import "../../chunks/index-server.js";
import { S as escape_html, o as stringify, r as ensure_array_like, t as attr_class, x as attr } from "../../chunks/server.js";
import "../../chunks/supabase.js";
//#region src/lib/sections/home/HeroSection.svelte
function HeroSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section${attr_class(`relative min-h-[90vh] mb-16 flex items-center -mt-16 pt-16 overflow-hidden transition-all duration-1000 opacity-0`)}><div class="absolute inset-0 z-0"><div class="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10"></div> <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div> <img alt="Elite athletes in mid-sprint" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCNxlOGZOI3hhCEG-p2ktXCzjxEHzrxXDF_AeJrPS0s1bKVQGHsjyB1W89M9mOUdiqvDYtJiAiAJSfIyf53w-wqIvfLA6SAzKAZ74-2Q4aSDg4a3G0fcc0nJRN4cqzkYHlLN_zIrMzWF2ixTTeNp93U1h-2_tfCSQRhR42Aa6MdCSPbXJNmJP6IAP61ORj2jy5b7WzHPe5a2_zC2oRSdgBR463HXs7W5Vf_JShGafVnhrs-xlZ3AMM2A"/></div> <div class="relative z-20 w-full px-margin-mobile lg:px-margin-desktop"><div class="max-w-4xl space-y-stack-md"><div class="flex items-center gap-stack-sm"><span class="w-3 h-3 bg-primary rounded-full"></span> <span class="font-label-caps text-label-caps animate-pulse text-primary-fixed uppercase tracking-widest">Live: Aro-League Season Open</span></div> <h1 class="font-display-xl text-display-xl text-white uppercase italic leading-[0.9] tracking-tighter">THE SPEED OF<br/> <span class="text-primary">KINETIC VELOCITY</span></h1> <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Experience the world's premier athletics league. Witness the raw power of human potential as elite athletes shatter records in high-definition speed.</p> <div class="flex flex-wrap gap-gutter pt-stack-md"><a href="/ranking" class="bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95 inline-block">WATCH LIVE</a> <a href="/ranking" class="border-2 border-secondary-fixed text-secondary-fixed hover:bg-secondary-fixed hover:text-on-secondary px-10 py-4 font-label-caps text-label-caps transition-all transform hover:scale-105 inline-block">VIEW STANDINGS</a></div></div></div> <div class="absolute bottom-20 right-0 w-1/3 h-px bg-gradient-to-l from-primary to-transparent opacity-50"></div> <div class="absolute bottom-24 right-0 w-1/4 h-px bg-gradient-to-l from-secondary-fixed to-transparent opacity-30"></div></section>`);
	});
}
//#endregion
//#region src/lib/sections/home/LiveStandings.svelte
function LiveStandings($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {Array<{profile_id: string, full_name: string, nationality: string, total_points: number, events_tracked: number, avatar_url?: string}>} */
		let rows = [];
		$$renderer.push(`<section${attr_class(`relative z-30 -mt-20 px-margin-mobile lg:px-margin-desktop transition-all duration-1000 opacity-0`)}><div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter"><div class="lg:col-span-8 bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden group"><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div> <div class="flex justify-between items-end mb-stack-lg"><h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Live Standings</h2> <span class="font-label-caps text-label-caps capitalize text-on-surface-variant mb-2">Leaders of the league</span></div> `);
		if (rows.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-white/10"><th class="py-stack-sm font-label-caps text-label-caps text-primary">RANK</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">ATHLETE</th><th class="py-stack-sm font-label-caps text-label-caps text-primary">NATION</th><th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">PTS</th></tr></thead><tbody class="divide-y divide-white/5"><!--[-->`);
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
				$$renderer.push(`<!--]--></div> <span class="font-headline-md text-headline-md text-white uppercase">${escape_html(row.full_name)}</span></td><td class="py-stack-md text-on-surface-variant font-label-caps">${escape_html(row.nationality || "---")}</td><td class="py-stack-md text-right font-stats-number text-stats-number text-white">${escape_html(row.total_points)}</td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-12 text-on-surface-variant font-body-md">No standings data available yet.</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="lg:col-span-4 flex flex-col gap-gutter"><a href="/ranking" class="bg-primary p-stack-lg flex flex-col justify-between aspect-square lg:aspect-auto h-full relative overflow-hidden group block"><div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><span class="material-symbols-outlined !text-[200px] text-on-primary">timer</span></div> <h3 class="font-label-caps text-label-caps text-on-primary uppercase tracking-widest">Full Leaderboard</h3> <div><p class="font-display-xl text-display-xl text-on-primary italic leading-none">${escape_html(rows[0]?.total_points ?? "---")}</p> <p class="font-label-caps text-label-caps text-on-primary-container mt-2">TOP SCORE THIS SEASON</p></div> <span class="bg-on-primary text-primary px-stack-md py-stack-sm font-label-caps text-label-caps w-fit">VIEW ALL</span></a></div></div></section>`);
	});
}
//#endregion
//#region src/lib/sections/home/UpcomingEvents.svelte
function UpcomingEvents($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {Array<{id: string, title: string, location: string, event_date: string, image_url: string}>} */
		let events = [];
		/** @param {string} dateString */
		function formatDate(dateString) {
			if (!dateString) return "";
			return new Date(dateString).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			}).toUpperCase();
		}
		$$renderer.push(`<section${attr_class(`py-margin-desktop bg-surface-container-lowest transition-all duration-1000 opacity-0`)}><div class="px-margin-mobile lg:px-margin-desktop mb-stack-lg flex justify-between items-center"><h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Upcoming Events</h2> <div class="flex gap-stack-sm"><button class="p-2 border border-white/10 hover:bg-primary hover:text-on-primary transition-all cursor-pointer"><span class="material-symbols-outlined">arrow_back</span></button> <button class="p-2 border border-white/10 hover:bg-primary hover:text-on-primary transition-all cursor-pointer"><span class="material-symbols-outlined">arrow_forward</span></button></div></div> `);
		if (events.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-gutter overflow-x-auto pb-stack-lg px-margin-mobile lg:px-margin-desktop no-scrollbar scroll-smooth"><!--[-->`);
			const each_array = ensure_array_like(events);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let event = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/competitions/${stringify(event.id)}`)} class="min-w-[320px] md:min-w-[400px] bg-surface-container-high group hover:bg-surface-variant transition-all block"><div class="h-48 w-full relative overflow-hidden">`);
				if (event.image_url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", event.image_url)}${attr("alt", event.title)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container-highest flex items-center justify-center transition-transform duration-500 group-hover:scale-110"><span class="material-symbols-outlined text-6xl text-outline">stadium</span></div>`);
				}
				$$renderer.push(`<!--]--> <div class="absolute top-4 left-4 bg-secondary-fixed text-on-secondary px-3 py-1 font-label-caps text-label-caps">${escape_html(formatDate(event.event_date))}</div></div> <div class="p-stack-lg space-y-stack-sm"><h4 class="font-headline-md text-headline-md text-white uppercase">${escape_html(event.title)}</h4> <p class="font-body-md text-on-surface-variant">${escape_html(event.location)}</p> <div class="pt-stack-md"><span class="block w-full border border-primary text-primary py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all text-center">VIEW DETAILS</span></div></div></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="px-margin-mobile lg:px-margin-desktop text-center py-12 text-on-surface-variant font-body-md">No upcoming events scheduled yet.</div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/sections/home/FeaturedAthlete.svelte
function FeaturedAthlete($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {{profile_id?: string, full_name?: string, total_points?: number, events_tracked?: number, avatar_url?: string, nationality?: string, club?: string}} */
		let athlete = {};
		$$renderer.push(`<section${attr_class(`relative bg-background py-margin-desktop overflow-hidden transition-all duration-1000 opacity-0`)}><div class="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low skew-x-[15deg] translate-x-20 z-0"></div> <div class="relative z-10 px-margin-mobile lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">`);
		if (athlete.profile_id) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative group"><div class="absolute inset-0 border-[12px] border-primary/20 -translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div> `);
			if (athlete.avatar_url) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<img${attr("src", athlete.avatar_url)}${attr("alt", athlete.full_name)} class="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl"/>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="w-full aspect-[4/5] bg-surface-variant relative z-10 shadow-2xl flex items-center justify-center"><svg class="w-24 h-24 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg></div>`);
			}
			$$renderer.push(`<!--]--> <div class="absolute -bottom-6 -right-6 bg-secondary-fixed p-stack-lg z-20"><p class="font-stats-number text-display-xl text-on-secondary italic leading-none">${escape_html(athlete.total_points ?? 0)}</p> <p class="font-label-caps text-label-caps text-on-secondary uppercase">TOTAL POINTS</p></div></div> <div class="space-y-stack-lg lg:pl-12"><div class="space-y-stack-sm"><h4 class="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">LEAGUE LEADER</h4> <h2 class="font-display-xl text-display-xl text-white italic uppercase leading-[0.8]">${escape_html(athlete.full_name)}<br/></h2></div> <div class="grid grid-cols-2 gap-gutter"><div class="border-l-2 border-primary pl-4"><p class="font-stats-number text-stats-number text-white">${escape_html(athlete.total_points ?? 0)}</p> <p class="font-label-caps text-label-caps text-on-surface-variant">TOTAL POINTS</p></div> <div class="border-l-2 border-primary pl-4"><p class="font-stats-number text-stats-number text-white">${escape_html(athlete.events_tracked ?? 0)}</p> <p class="font-label-caps text-label-caps text-on-surface-variant">EVENTS</p></div></div> <p class="font-body-lg text-body-lg text-on-surface-variant">The current leader of the V-League standings. With exceptional performance across all events, ${escape_html(athlete.full_name)} sets the standard for competitive excellence.</p> <a${attr("href", `/athletes/${stringify(athlete.profile_id)}`)} class="inline-block bg-white text-background px-12 py-4 font-label-caps text-label-caps uppercase hover:bg-primary transition-colors">Full Profile</a></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="lg:col-span-2 text-center py-20 text-on-surface-variant font-body-md">No featured athlete data available yet.</div>`);
		}
		$$renderer.push(`<!--]--></div></section>`);
	});
}
//#endregion
//#region src/lib/sections/home/NewsMediaGrid.svelte
function NewsMediaGrid($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {Array<{id: string, title: string, slug: string, excerpt: string, image_url: string, author: string, published_at: string}>} */
		let posts = [];
		$$renderer.push(`<section${attr_class(`py-margin-desktop px-margin-mobile lg:px-margin-desktop transition-all duration-1000 opacity-0`)}><div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md"><div><h2 class="font-headline-lg text-headline-lg text-white uppercase italic">News &amp; Analysis</h2> <div class="h-1 w-24 bg-primary mt-2"></div></div> <a href="/blog" class="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-2 uppercase">Explore all media <span class="material-symbols-outlined">trending_flat</span></a></div> `);
		if (posts.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"><!--[-->`);
			const each_array = ensure_array_like(posts);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let post = each_array[$$index];
				$$renderer.push(`<a${attr("href", `/blog/${stringify(post.slug)}`)} class="group cursor-pointer block"><div class="relative aspect-video overflow-hidden mb-stack-md">`);
				if (post.image_url) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", post.image_url)}${attr("alt", post.title)} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-full h-full bg-surface-variant flex items-center justify-center transition-transform duration-700 group-hover:scale-110"><span class="material-symbols-outlined text-5xl text-outline">article</span></div>`);
				}
				$$renderer.push(`<!--]--> <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div> <div class="absolute bottom-4 left-4 font-label-caps text-[10px] bg-primary text-on-primary px-2 py-1">ARTICLE</div></div> <h3 class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors line-clamp-2">${escape_html(post.title)}</h3> <p class="font-body-md text-on-surface-variant mt-2 line-clamp-2">${escape_html(post.excerpt || "Read more about the latest V-League developments.")}</p></a>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-center py-12 text-on-surface-variant font-body-md">No articles published yet. Check back soon.</div>`);
		}
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/sections/home/CtaBanner.svelte
function CtaBanner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section${attr_class(`mx-margin-mobile lg:mx-margin-desktop my-margin-desktop relative overflow-hidden transition-all duration-1000 opacity-0`)}><div class="bg-primary px-stack-lg py-20 flex flex-col items-center text-center relative z-10"><div class="absolute top-0 right-0 opacity-10"><span class="material-symbols-outlined !text-[300px] text-on-primary -rotate-12 translate-x-20">bolt</span></div> <h2 class="font-display-xl text-display-xl text-on-primary italic uppercase max-w-2xl mb-stack-lg">STAY IN THE SLIPSTREAM</h2> <p class="font-body-lg text-on-primary-container max-w-xl mb-stack-lg">Join 500,000+ fans for exclusive access to race highlights, athlete interviews, and priority ticketing.</p> <div class="flex flex-col sm:flex-row gap-stack-md w-full max-w-md"><input type="email"${attr("value", "")} placeholder="ENTER YOUR EMAIL" class="flex-grow bg-white/20 border-b-2 border-on-primary-container p-4 font-label-caps text-on-primary placeholder:text-on-primary-container/60 focus:bg-white/30 outline-none"/> <button${attr("disabled", false, true)} class="bg-on-primary text-primary font-label-caps text-label-caps px-8 py-4 hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer">${escape_html("SUBSCRIBE")}</button></div></div></section>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer) {
	$$renderer.push(`<div class="flex flex-col w-full overflow-x-hidden bg-background">`);
	HeroSection($$renderer, {});
	$$renderer.push(`<!----> `);
	LiveStandings($$renderer, {});
	$$renderer.push(`<!----> `);
	UpcomingEvents($$renderer, {});
	$$renderer.push(`<!----> `);
	FeaturedAthlete($$renderer, {});
	$$renderer.push(`<!----> `);
	NewsMediaGrid($$renderer, {});
	$$renderer.push(`<!----> `);
	CtaBanner($$renderer, {});
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _page as default };

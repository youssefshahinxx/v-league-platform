import { S as escape_html, o as stringify, r as ensure_array_like, x as attr } from "../../../../chunks/server.js";
//#region src/routes/profile/edit/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {{ data: import('./$types').PageData }} */
		let { data } = $$props;
		let fullName = "";
		let nationality = "";
		let gender = "";
		let dob = "";
		let club = "";
		let bio = "";
		let facebookUrl = "";
		let tiktokUrl = "";
		let instagramUrl = "";
		/** @type {Array<{name: string, url: string, type: string}>} */
		let certificates = [];
		let isSaving = false;
		$$renderer.push(`<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop max-w-6xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start"><div class="md:col-span-1 space-y-stack-lg"><div><h1 class="font-headline-lg text-headline-lg text-white uppercase italic">Account Settings</h1> <p class="font-body-md text-on-surface-variant mt-2">Manage your public athletic directory presence.</p></div> <div class="bg-surface-container-low p-stack-lg"><h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Verified League Achievements</h3> `);
		if (data.profile?.achievements && data.profile.achievements.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-stack-sm"><!--[-->`);
			const each_array = ensure_array_like(data.profile.achievements);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let achievement = each_array[$$index];
				$$renderer.push(`<span class="font-label-caps text-label-caps bg-primary/15 text-primary px-stack-sm py-stack-sm">🏆 ${escape_html(achievement)}</span>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="font-body-md text-on-surface-variant">No official tournament achievements recorded yet.</p>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-surface-container-low p-stack-lg border border-white/5 space-y-stack-md"><h3 class="font-label-caps text-label-caps text-primary uppercase">Performance Stats</h3> <div class="border-t border-white/5 pt-stack-md space-y-stack-md"><div class="flex items-center justify-between"><span class="font-body-md text-on-surface-variant">Total Points</span> <span class="font-stats-number text-[20px] text-secondary-fixed">${escape_html(data.stats?.total_points ?? 0)}</span></div> <div class="flex items-center justify-between"><span class="font-body-md text-on-surface-variant">Events Competed</span> <span class="font-stats-number text-[20px] text-secondary-fixed">${escape_html(data.stats?.events_tracked ?? 0)}</span></div> <div class="flex items-center justify-between"><span class="font-body-md text-on-surface-variant">Global Rank</span> <span class="font-stats-number text-[20px] text-secondary-fixed">${escape_html(data.stats?.rank ? "#" + data.stats.rank : "---")}</span></div></div></div></div> <form class="md:col-span-2 bg-surface-container-high p-stack-lg space-y-stack-lg">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center gap-stack-md pb-stack-lg border-b border-white/5"><div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant"><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg></div>`);
		$$renderer.push(`<!--]--></div> <label class="cursor-pointer"><span class="inline-flex items-center border border-primary text-primary px-stack-md py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">Change Photo</span> <input type="file" accept="image/*" class="hidden"/></label></div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg"><div class="flex flex-col gap-stack-sm"><label for="fullName" class="font-label-caps text-label-caps text-on-surface-variant">Full Name</label> <input id="fullName" type="text"${attr("value", fullName)} required="" class="w-full bg-surface-container border-b-2 border-white/10 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"/></div> <div class="flex flex-col gap-stack-sm"><label for="club" class="font-label-caps text-label-caps text-on-surface-variant">Club Affiliation (Optional)</label> <input id="club" type="text"${attr("value", club)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"/></div> <div class="flex flex-col gap-stack-sm"><label for="nationality" class="font-label-caps text-label-caps text-on-surface-variant">Nationality Code</label> <input id="nationality" type="text" maxlength="3" placeholder="E.g. EGY, USA"${attr("value", nationality)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors uppercase"/></div> <div class="flex flex-col gap-stack-sm"><label for="dob" class="font-label-caps text-label-caps text-on-surface-variant">Date of Birth</label> <input id="dob" type="date"${attr("value", dob)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors"/></div> <div class="flex flex-col gap-stack-sm sm:col-span-2"><label for="gender" class="font-label-caps text-label-caps text-on-surface-variant">Gender Identity</label> `);
		$$renderer.select({
			id: "gender",
			value: gender,
			class: "w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors"
		}, ($$renderer) => {
			$$renderer.option({
				value: "",
				class: "bg-surface-container"
			}, ($$renderer) => {
				$$renderer.push(`Select Gender`);
			});
			$$renderer.option({
				value: "Male",
				class: "bg-surface-container"
			}, ($$renderer) => {
				$$renderer.push(`Male`);
			});
			$$renderer.option({
				value: "Female",
				class: "bg-surface-container"
			}, ($$renderer) => {
				$$renderer.push(`Female`);
			});
			$$renderer.option({
				value: "Other",
				class: "bg-surface-container"
			}, ($$renderer) => {
				$$renderer.push(`Other`);
			});
		});
		$$renderer.push(`</div> <div class="flex flex-col gap-stack-sm sm:col-span-2"><label for="bio" class="font-label-caps text-label-caps text-on-surface-variant">Athlete Biography</label> <textarea id="bio" rows="4" placeholder="Briefly introduce your athletic background..." class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors resize-none">`);
		const $$body = escape_html(bio);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea></div></div> <div class="border-t border-white/5 pt-stack-lg"><h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Social Links</h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg"><div class="flex flex-col gap-stack-sm"><label for="facebookUrl" class="font-label-caps text-label-caps text-on-surface-variant">Facebook URL</label> <input id="facebookUrl" type="url" placeholder="https://facebook.com/..."${attr("value", facebookUrl)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"/></div> <div class="flex flex-col gap-stack-sm"><label for="tiktokUrl" class="font-label-caps text-label-caps text-on-surface-variant">TikTok URL</label> <input id="tiktokUrl" type="url" placeholder="https://tiktok.com/..."${attr("value", tiktokUrl)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"/></div> <div class="flex flex-col gap-stack-sm sm:col-span-2"><label for="instagramUrl" class="font-label-caps text-label-caps text-on-surface-variant">Instagram URL</label> <input id="instagramUrl" type="url" placeholder="https://instagram.com/..."${attr("value", instagramUrl)} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"/></div></div></div> <div class="border-t border-white/5 pt-stack-lg"><h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Certificates &amp; Documents</h3> `);
		if (certificates.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-stack-sm mb-stack-md"><!--[-->`);
			const each_array_1 = ensure_array_like(certificates);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let cert = each_array_1[i];
				$$renderer.push(`<div class="flex items-center justify-between bg-surface-container border border-white/5 px-stack-md py-stack-sm gap-stack-md"><div class="flex items-center gap-stack-md min-w-0">`);
				if (cert.type === "image") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<img${attr("src", cert.url)}${attr("alt", cert.name)} class="w-10 h-10 rounded object-cover border border-white/10 flex-shrink-0"/>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="w-10 h-10 rounded bg-surface-variant flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg></div>`);
				}
				$$renderer.push(`<!--]--> <a${attr("href", cert.url)} target="_blank" rel="noopener noreferrer" class="font-body-md text-white hover:text-primary truncate transition-colors">${escape_html(cert.name)}</a></div> <button type="button" class="text-on-surface-variant hover:text-error transition-colors flex-shrink-0 cursor-pointer"${attr("aria-label", `Remove ${stringify(cert.name)}`)}><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="font-body-md text-on-surface-variant mb-stack-md">No certificates uploaded yet.</p>`);
		}
		$$renderer.push(`<!--]--> <label class="inline-flex items-center gap-2 cursor-pointer"><span class="inline-flex items-center border border-primary text-primary px-4 py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">Add File</span> <input type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" multiple="" class="hidden"/></label></div> <div class="flex justify-start gap-stack-md pt-stack-lg border-t border-white/5 flex-wrap"><button type="submit"${attr("disabled", isSaving, true)} class="bg-primary text-on-primary px-8 py-stack-sm font-label-caps text-label-caps hover:bg-primary/90 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">${escape_html("SAVE PROFILE")}</button> <button type="button" class="border border-error text-error px-6 py-stack-sm font-label-caps text-label-caps hover:bg-error/10 transition-all cursor-pointer">Sign Out</button></div></form></div></div>`);
	});
}
//#endregion
export { _page as default };

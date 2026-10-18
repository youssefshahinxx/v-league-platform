import "../../chunks/index-server.js";
import { S as escape_html, n as derived, r as ensure_array_like, x as attr } from "../../chunks/server.js";
import "../../chunks/client.js";
import "../../chunks/navigation.js";
import "../../chunks/supabase.js";
//#region src/lib/components/layout/Navbar.svelte
function Navbar($$renderer, $$props) {
	let { isLoggedIn = false } = $$props;
	const navLinks = [
		{
			label: "Ranking",
			href: "/ranking"
		},
		{
			label: "Events",
			href: "/competitions"
		},
		{
			label: "Athletes",
			href: "/athletes"
		},
		{
			label: "News",
			href: "/blog"
		},
		{
			label: "Contact",
			href: "/contact"
		}
	];
	$$renderer.push(`<header class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-2xl border-b border-white/5"><div class="h-20 md:h-28 w-full px-margin-mobile lg:px-margin-desktop flex items-center justify-between"><div class="flex items-center gap-4"><a href="/"><img src="assets/V-LOGO.png" alt="Athletics League Logo" class="h-full w-10 md:w-20 rounded-full object-contain"/></a> <a href="/" class="font-headline-md text-headline-md text-primary tracking-wider uppercase hidden sm:block">Athletics League</a></div> <nav class="hidden lg:flex items-center gap-stack-lg"><!--[-->`);
	const each_array = ensure_array_like(navLinks);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let link = each_array[$$index];
		$$renderer.push(`<a${attr("href", link.href)} class="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-all">${escape_html(link.label)}</a>`);
	}
	$$renderer.push(`<!--]--></nav> <div class="flex items-center gap-stack-md">`);
	if (!isLoggedIn) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<a href="/auth" class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></a>`);
	} else {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<a href="/profile/edit" class="w-8 h-8 rounded-full flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-40">person</span></a> <button class="text-xs font-bold text-primary hover:text-on-surface transition-colors cursor-pointer">Logout</button>`);
	}
	$$renderer.push(`<!--]--> <button class="lg:hidden p-unit cursor-pointer"><span class="material-symbols-outlined text-on-surface">${escape_html("menu")}</span></button></div></div> `);
	$$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></header>`);
}
//#endregion
//#region src/lib/components/layout/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		$$renderer.push(`<footer class="w-full bg-surface-container-lowest border-t border-white/5 pt-stack-lg pb-margin-mobile"><div class="w-full px-margin-mobile lg:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter"><div class="space-y-stack-md"><div class="flex items-center gap-4"><img src="/assets/V-LOGO.png" alt="Athletics League Logo" class="h-6 w-auto object-contain"/> <span class="font-headline-md text-headline-md text-on-surface">AL</span></div> <p class="text-on-surface-variant font-body-md max-w-xs">The elite standard of global athletics. Velocity, precision, and peak performance.</p> <div class="flex gap-stack-md"><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Facebook"><span class="material-symbols-outlined">share</span></a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Instagram"><span class="material-symbols-outlined">public</span></a> <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="TikTok"><span class="material-symbols-outlined">podcasts</span></a></div></div> <div class="space-y-stack-md"><h4 class="font-label-caps text-label-caps text-primary">QUICK LINKS</h4> <div class="grid grid-cols-2 gap-stack-sm"><a href="/ranking" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Standings</a> <a href="/competitions" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Events</a> <a href="/athletes" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Athletes</a> <a href="/blog" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">News</a> <a href="/contact" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Contact</a></div></div> <div class="space-y-stack-md"><h4 class="font-label-caps text-label-caps text-primary">NEWSLETTER</h4> <div class="flex gap-0"><input class="bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm w-full focus:border-primary outline-none text-on-surface font-body-md" placeholder="Email address" type="email"/> <button class="bg-primary px-stack-md py-stack-sm cursor-pointer"><span class="material-symbols-outlined text-on-primary">arrow_forward</span></button></div> <p class="text-[10px] text-on-tertiary-fixed-variant uppercase tracking-widest">Join 50k+ elite fans</p></div></div> <div class="w-full px-margin-mobile lg:px-margin-desktop mt-stack-lg pt-stack-md border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-stack-sm text-[12px] text-on-tertiary-fixed-variant"><p>© ${escape_html(currentYear)} V-LEAGUE. ALL RIGHTS RESERVED.</p> <div class="flex gap-stack-md"><a href="/" class="hover:text-on-surface transition-colors">PRIVACY</a> <a href="/" class="hover:text-on-surface transition-colors">TERMS</a> <a href="/" class="hover:text-on-surface transition-colors">COOKIES</a></div></div></footer>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, children } = $$props;
		let isLoggedIn = derived(() => Boolean(data?.session));
		$$renderer.push(`<div class="min-h-screen bg-background text-on-surface font-body-md">`);
		Navbar($$renderer, { isLoggedIn: isLoggedIn() });
		$$renderer.push(`<!----> <main class="w-full pt-16 min-h-screen">`);
		children?.($$renderer);
		$$renderer.push(`<!----></main> `);
		Footer($$renderer, {});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _layout as default };

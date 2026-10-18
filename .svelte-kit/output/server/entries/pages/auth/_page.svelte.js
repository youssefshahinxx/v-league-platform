import "../../../chunks/index-server.js";
import { a as store_get, n as derived, s as unsubscribe_stores } from "../../../chunks/server.js";
import "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import "../../../chunks/supabase.js";
import { i as page } from "../../../chunks/ui.js";
//#endregion
//#region src/routes/auth/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("mode") === "register" ? "register" : "login");
		$$renderer.push(`<div class="min-h-screen w-full flex flex-col items-center justify-center bg-background px-margin-mobile py-margin-desktop"><div class="mb-stack-lg text-center flex flex-col items-center"><a href="/" class="font-headline-lg text-headline-lg text-white uppercase italic rounded-md p-1 mb-stack-sm hover:text-primary transition-colors">V-LEAGUE</a> <div class="h-1 w-16 bg-primary"></div></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="w-full max-w-md bg-surface-container-high border border-white/5 p-stack-lg text-center font-body-md text-on-surface-variant">Checking your session...</div>`);
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _page as default };

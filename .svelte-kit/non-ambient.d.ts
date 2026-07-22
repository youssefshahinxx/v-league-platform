
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/athletes" | "/athletes/[id]" | "/auth" | "/auth/logout" | "/blog" | "/blog/[slug]" | "/competitions" | "/competitions/[id]" | "/profile" | "/profile/edit" | "/ranking";
		RouteParams(): {
			"/athletes/[id]": { id: string };
			"/blog/[slug]": { slug: string };
			"/competitions/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; slug?: string | undefined };
			"/admin": Record<string, never>;
			"/athletes": { id?: string | undefined };
			"/athletes/[id]": { id: string };
			"/auth": Record<string, never>;
			"/auth/logout": Record<string, never>;
			"/blog": { slug?: string | undefined };
			"/blog/[slug]": { slug: string };
			"/competitions": { id?: string | undefined };
			"/competitions/[id]": { id: string };
			"/profile": Record<string, never>;
			"/profile/edit": Record<string, never>;
			"/ranking": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/athletes" | `/athletes/${string}` & {} | "/auth" | "/auth/logout" | "/blog" | `/blog/${string}` & {} | "/competitions" | `/competitions/${string}` & {} | "/profile/edit" | "/ranking";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}
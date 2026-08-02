<script>
    const currentYear = new Date().getFullYear();
</script>

<footer class="w-full bg-surface-container-lowest border-t border-white/5 pt-stack-lg pb-margin-mobile">
    <div class="w-full px-margin-mobile lg:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div class="space-y-stack-md">
            <div class="flex items-center gap-4">
                <img
                    src="/assets/V-LOGO.png"
                    alt="Athletics League Logo"
                    class="h-6 w-auto object-contain"
                />
                <span class="font-headline-md text-headline-md text-on-surface">AL</span>
            </div>
            <p class="text-on-surface-variant font-body-md max-w-xs">
                The elite standard of global athletics. Velocity, precision, and peak performance.
            </p>
            <div class="flex gap-stack-md">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Facebook">
                    <span class="material-symbols-outlined">share</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="Instagram">
                    <span class="material-symbols-outlined">public</span>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" aria-label="TikTok">
                    <span class="material-symbols-outlined">podcasts</span>
                </a>
            </div>
        </div>
        <div class="space-y-stack-md">
            <h4 class="font-label-caps text-label-caps text-primary">QUICK LINKS</h4>
            <div class="grid grid-cols-2 gap-stack-sm">
                <a href="/ranking" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Standings</a>
                <a href="/competitions" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Events</a>
                <a href="/athletes" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Athletes</a>
                <a href="/blog" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">News</a>
                <a href="/contact" class="text-on-surface-variant font-body-md hover:text-on-surface transition-colors">Contact</a>
            </div>
        </div>
        <div class="space-y-stack-md">
            <h4 class="font-label-caps text-label-caps text-primary">NEWSLETTER</h4>
            <div class="flex gap-0">
                <input
                    class="bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm w-full focus:border-primary outline-none text-on-surface font-body-md"
                    placeholder="Email address"
                    type="email"
                />
                <button class="bg-primary px-stack-md py-stack-sm cursor-pointer">
                    <span class="material-symbols-outlined text-on-primary">arrow_forward</span>
                </button>
            </div>
            <p class="text-[10px] text-on-tertiary-fixed-variant uppercase tracking-widest">Join 50k+ elite fans</p>
        </div>
    </div>
    <div class="w-full px-margin-mobile lg:px-margin-desktop mt-stack-lg pt-stack-md border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-stack-sm text-[12px] text-on-tertiary-fixed-variant">
        <p>&copy; {currentYear} V-LEAGUE. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-stack-md">
            <a href="/" class="hover:text-on-surface transition-colors">PRIVACY</a>
            <a href="/" class="hover:text-on-surface transition-colors">TERMS</a>
            <a href="/" class="hover:text-on-surface transition-colors">COOKIES</a>
        </div>
    </div>
</footer>

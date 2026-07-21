<script>
    const currentYear = new Date().getFullYear();
</script>

<footer class="bg-white border-t border-zinc-200">
    <div class="max-w-7xl mx-auto py-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div class="flex justify-center space-x-6 md:order-2 text-sm text-zinc-500">
            <a href="/ranking" class="hover:text-zinc-900 transition-colors">Global Rankings</a>
            <a href="/athletes" class="hover:text-zinc-900 transition-colors">Athletes</a>
            <a href="/competitions" class="hover:text-zinc-900 transition-colors">Events</a>
            <a href="/admin" class="hover:text-zinc-900 transition-colors">League Admin</a>
        </div>
        <div class="mt-8 md:order-1 md:mt-0">
            <p class="text-center text-xs leading-5 text-zinc-500">
                &copy; {currentYear} V-League Architecture. Engineered for high-stakes competition.
            </p>
        </div>
    </div>
</footer>
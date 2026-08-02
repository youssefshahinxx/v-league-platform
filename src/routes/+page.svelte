<script>
    import HeroSection from "$lib/sections/home/HeroSection.svelte";
    import LiveStandings from "$lib/sections/home/LiveStandings.svelte";
    import UpcomingEvents from "$lib/sections/home/UpcomingEvents.svelte";
    import FeaturedAthlete from "$lib/sections/home/FeaturedAthlete.svelte";
    import NewsMediaGrid from "$lib/sections/home/NewsMediaGrid.svelte";
    import CtaBanner from "$lib/sections/home/CtaBanner.svelte";
</script>

<div class="flex flex-col w-full overflow-x-hidden bg-background">
    <HeroSection />
    <LiveStandings />
    <UpcomingEvents />
    <FeaturedAthlete />
    <NewsMediaGrid />
    <CtaBanner />
</div>

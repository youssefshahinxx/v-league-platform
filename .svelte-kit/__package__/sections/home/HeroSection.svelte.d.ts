export default HeroSection;
type HeroSection = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const HeroSection: import("svelte").Component<Record<string, never>, {}, "">;

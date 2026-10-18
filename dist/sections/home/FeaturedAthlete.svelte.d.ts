export default FeaturedAthlete;
type FeaturedAthlete = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const FeaturedAthlete: import("svelte").Component<Record<string, never>, {}, "">;

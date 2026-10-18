export default LiveStandings;
type LiveStandings = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const LiveStandings: import("svelte").Component<Record<string, never>, {}, "">;

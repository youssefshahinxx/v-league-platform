export default UpcomingEvents;
type UpcomingEvents = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const UpcomingEvents: import("svelte").Component<Record<string, never>, {}, "">;

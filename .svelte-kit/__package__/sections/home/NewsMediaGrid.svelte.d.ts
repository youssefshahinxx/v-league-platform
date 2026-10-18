export default NewsMediaGrid;
type NewsMediaGrid = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const NewsMediaGrid: import("svelte").Component<Record<string, never>, {}, "">;

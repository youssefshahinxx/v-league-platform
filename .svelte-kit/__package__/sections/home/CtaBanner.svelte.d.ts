export default CtaBanner;
type CtaBanner = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<Record<string, never>>): void;
};
declare const CtaBanner: import("svelte").Component<Record<string, never>, {}, "">;

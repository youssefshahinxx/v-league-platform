export default CompetitionEventTable;
type CompetitionEventTable = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const CompetitionEventTable: import("svelte").Component<{
    competitionEventId: any;
    title?: string;
}, {}, "">;
type $$ComponentProps = {
    competitionEventId: any;
    title?: string;
};

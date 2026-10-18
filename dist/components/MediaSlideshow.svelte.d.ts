export default MediaSlideshow;
type MediaSlideshow = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const MediaSlideshow: import("svelte").Component<{
    media: Array<{
        url: string;
        type?: string;
    }>;
    heroImage?: string;
}, {}, "">;
type $$ComponentProps = {
    media: Array<{
        url: string;
        type?: string;
    }>;
    heroImage?: string;
};

declare const Card: import("svelte").Component<{
    padding?: "sm" | "md" | "lg";
    shadow?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
    class?: string;
    children: any;
}, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;

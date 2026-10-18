declare const Badge: import("svelte").Component<{
    variant?: "default" | "success" | "warning" | "accent";
    class?: string;
    children: any;
}, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;

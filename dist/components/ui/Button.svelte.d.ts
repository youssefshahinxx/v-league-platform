declare const Button: import("svelte").Component<{
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    class?: string;
    children: any;
}, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;

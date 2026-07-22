# Development Tips for This Project

## 1. Follow the current architecture
- This project is a SvelteKit app with Supabase for auth and database access.
- Keep route logic in the route files under src/routes.
- Keep reusable UI in src/lib/components.
- Keep shared helpers in src/lib.

## 2. Match the existing coding style
- Use the same Svelte 5 patterns already present in the project.
- Prefer simple, explicit code over clever abstractions.
- Do not add features unless the user asked for them.
- Do not reformat existing files unnecessarily.

## 3. Use the correct SvelteKit patterns
- For page data loaded from the server, use a +page.server.js file when you need protected access or server-side data fetching.
- For client-side UI logic, keep the behavior in the .svelte file.
- When passing data into a component, use props clearly and keep the shape predictable.

## 4. Handle Supabase safely
- Always check whether a session exists before calling session-based operations.
- Avoid assuming that supabase.auth.getSession() always returns a valid user.
- When using .from(...).update(...) or .insert(...), make sure the user is authenticated first.

## 5. Keep state initialization safe
- When using Svelte 5 runes, initialize values with defaults such as '' or null instead of reading props directly in a way that can trigger compiler warnings.
- If a value depends on loaded data, update it in a reactive effect or after the data is available.

## 6. Before changing code
- Read the existing file first.
- Understand the current data flow.
- Fix the root cause instead of patching symptoms.
- Make the smallest change that solves the issue.

## 7. Verify changes before finishing
- Run npm run check after edits.
- If a bug is fixed, confirm with the relevant check or runtime behavior.
- Do not claim success without verification output.

## 8. Good habits for AI-assisted development
- Keep changes minimal and focused.
- Preserve the current app behavior.
- Avoid adding unrelated styling or features.
- Prefer clear comments only where they help explain non-obvious logic.

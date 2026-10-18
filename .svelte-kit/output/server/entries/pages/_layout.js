import { t as getSession } from "../../chunks/auth.js";
//#region src/routes/+layout.js
var ssr = false;
async function load() {
	return { session: await getSession() };
}
//#endregion
export { load, ssr };

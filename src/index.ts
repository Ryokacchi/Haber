import { getCategory } from "./functions/http.js";
import { start } from "./modules/client.js";

await getCategory("kadin");
await start();
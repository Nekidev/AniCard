import fs from "fs";
var path = require('path');


/*
 * Returns the contents of a query file in the queries folder.
 */
export function getQuery(name: string): string {
    return fs.readFileSync(path.join(process.cwd(), `/src/utils/queries/${name}.graphql`), "utf-8");
}

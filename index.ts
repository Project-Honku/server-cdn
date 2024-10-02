import path from "path/posix";
import { fileTypeFromBuffer } from "file-type";

const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
}

Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);
        const filepath = path.join(process.cwd(), "assets", url.pathname);
        const file = Bun.file(path.normalize(filepath));

        if (await file.exists()) {
            const founded = await file.bytes();
            const mime = await fileTypeFromBuffer(founded)
                .then(res => res?.mime ?? "application/octet-stream");

            return new Response(founded, {
                status: 200,
                headers: { "Content-Type": mime, ...cors }
            });
        } else {
            return new Response("404 Not Found", { status: 404, headers: cors });
        }
    }
});

console.log("Server CDN diaktifkan!");
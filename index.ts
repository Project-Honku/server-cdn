import path from "path/posix";

const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
}

Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);

        const assetsPath = path.join(process.cwd(), "assets");
        const filePath = path.join(assetsPath, url.pathname);
        const normalized = path.normalize(filePath);

        // Pencegahan directory traversal
        if (!normalized.startsWith(assetsPath)) {
            return new Response("403 Forbidden", { status: 403, headers: cors })
        }

        const file = Bun.file(normalized);

        if (await file.exists()) {
            const bytes = await file.bytes();
            return new Response(bytes, {
                status: 200,
                headers: { "Content-Type": file.type, ...cors }
            });
        } else {
            return new Response("404 Not Found", { status: 404, headers: cors });
        }
    }
});

console.log("Server CDN diaktifkan!");
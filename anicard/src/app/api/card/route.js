import API from "@/lib/apis";

const card_modes = {
    1: {
        width: 1200,
        zoom: 2,
    },
    2: {
        width: 1200,
        height: 500,
        zoom: 1,
    },
};

const encodeGetParams = (p) =>
    Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");

export async function GET(request) {
    const id = parseInt(request.nextUrl.searchParams.get("id"));
    const source = request.nextUrl.searchParams.get("source").toLowerCase() || "anilist";
    const mode = request.nextUrl.searchParams.get("mode") || "1";

    if (!card_modes[mode]) {
        return new Response(JSON.stringify({ message: "Invalid mode" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!API.validWrapper(source)) {
        return new Response(JSON.stringify({ message: "Invalid source" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const card = await (new API(source)).getAnime(id);

    const url = `https://ani-card.vercel.app/cards/${mode}?image_url=${encodeURIComponent(
        card.imageUrl
    )}&color=${encodeURIComponent(card.color)}&subtitle=${encodeURIComponent(
        card.subtitle
    )}&label=${encodeURIComponent(card.label)}&title=${encodeURIComponent(
        card.title
    )}&tags=${encodeURIComponent(card.tags.join(","))}`;

    console.log(url);

    const image = await (
        await fetch(
            `${process.env.SCREENSHOTS_API_URL}?url=${encodeURIComponent(
                url
            )}&${encodeGetParams(card_modes[mode])}`
        )
    ).arrayBuffer();

    return new Response(image, {
        headers: {
            "Cache-Control":
                "public, immutable, no-transform, s-maxage=86400, max-age=86400",
            "Content-Type": "image/png",
        },
    });
}

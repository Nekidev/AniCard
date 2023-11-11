import API, { WrapperCode, ExtraCode, Extra } from "@/lib/apis";

const card_styles = {
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

const encodeGetParams = (p: object) =>
    Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");

type CardStyle = "1" | "2";

export async function GET(request) {
    const id: string = request.nextUrl.searchParams.get("id");
    const source: WrapperCode = (
        request.nextUrl.searchParams.get("source") || "anilist"
    ).toLowerCase();
    const style: CardStyle = request.nextUrl.searchParams.get("style") || "1";
    const extra: ExtraCode | null = request.nextUrl.searchParams.get("extra");

    if (!card_styles[style]) {
        return new Response(JSON.stringify({ message: "Invalid style" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!new API("anilist").validWrapper(source)) {
        return new Response(JSON.stringify({ message: "Invalid source" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const card = await new API(source).getAnime(id);

    let url = `${process.env.HOST_URL || "https://card.nyeki.dev"}/cards/${style}?image_url=${encodeURIComponent(
        card.imageUrl
    )}&color=${encodeURIComponent(card.color)}&subtitle=${encodeURIComponent(
        card.subtitle
    )}&label=${encodeURIComponent(card.label)}&title=${encodeURIComponent(
        card.title
    )}&tags=${encodeURIComponent(card.tags.join(","))}`;

    if (extra && card.extras.map((v: Extra) => v.code.toString()).includes(extra.toLowerCase())) {
        url += `&extra=${encodeURIComponent(
            JSON.stringify(card.extras.filter((v: Extra) => v.code == extra)[0])
        )}`;
    }

    console.log(url);

    const image = await (
        await fetch(
            `${process.env.SCREENSHOTS_API_URL}?url=${encodeURIComponent(
                url
            )}&${encodeGetParams(card_styles[style])}`
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

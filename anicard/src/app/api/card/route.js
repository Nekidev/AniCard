import { capitalizeFirstLetter } from "@/utils";

const animeQuery = `
query MediaQuery($id:Int) {
	Media(id:$id) {
        id
        idMal
        title {
            romaji
            english
            native
            userPreferred
        }
        coverImage {
            extraLarge
            large
            medium
            color
        }
        bannerImage
        description
        type
        episodes
        status
        startDate {
            year
            month
            day
        }
        endDate {
            year
            month
            day
        }
        duration
        source
        season
        seasonYear
        format
        genres
    }
}`;

const card_modes = {
    1: {
        width: 1200,
        zoom: 2,
    },
    2: {
        width: 2400,
        height: 1000,
        zoom: 2,
    },
};

const encodeGetParams = (p) =>
    Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");

export async function GET(request) {
    const id = parseInt(request.nextUrl.searchParams.get("id"));
    const mode = request.nextUrl.searchParams.get("mode") || "1";

    if (!card_modes[mode]) {
        return new Response.json({ message: "Invalid mode" }, { status: 400 });
    }

    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: animeQuery,
            variables: {
                id,
            },
        }),
    });
    const data = await response.json();

    const url = `https://ani-card.vercel.app/cards/${mode}?image_url=${encodeURIComponent(
        data.data.Media.coverImage.extraLarge
    )}&bg_color=${encodeURIComponent(
        data.data.Media.coverImage.color
    )}&season=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.season) +
            " " +
            data.data.Media.seasonYear
    )}&title=${encodeURIComponent(
        data.data.Media.title.userPreferred
    )}&type=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.format)
    )}&duration=${encodeURIComponent(
        data.data.Media.episodes > 1
            ? `${data.data.Media.episodes} episodes`
            : Math.floor(data.data.Media.duration / 60) > 0
            ? `${Math.floor(data.data.Media.duration / 60)} hrs ${
                  data.data.Media.duration % 60
              } min`
            : `${data.data.Media.duration % 60} minutes`
    )}&source=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.source)
    )}&genres=${encodeURIComponent(
        data.data.Media.genres.join(",")
    )}&status=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.status)
    )}&status=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.status)
    )}`;

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

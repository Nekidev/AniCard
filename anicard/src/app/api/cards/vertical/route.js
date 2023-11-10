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

export async function GET(request) {
    const id = parseInt(request.nextUrl.searchParams.get("id"));
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

    console.log(data);

    const url = `https://ani-card.vercel.app/cards/vertical?image_url=${encodeURIComponent(
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

    const image = await (
        await fetch(
            `${process.env.SCREENSHOTS_API_URL}?url=${encodeURIComponent(
                url
            )}&width=1200&zoom=2`
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

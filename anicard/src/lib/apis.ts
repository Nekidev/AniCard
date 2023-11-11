import { capitalizeFirstLetter, getMiddleShade, rgbToHex } from "@/utils";

import { getColor } from "colorthief";

export class Card {
    id: number;
    title: string;
    subtitle: string;
    label: string;
    tags: Array<string>;
    imageUrl: string;
    color: string;

    constructor(
        id: number,
        title: string,
        subtitle: string,
        label: string,
        tags: Array<string>,
        imageUrl: string,
        color: string
    ) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.label = label;
        this.tags = tags;
        this.imageUrl = imageUrl;
        this.color = color;
    }
}

class Wrapper {
    url: string;

    async getAnime(id: number): Promise<Card> {
        throw new Error("Method not implemented.");
    }
}

export class AniList extends Wrapper {
    url = "https://graphql.anilist.co";

    async getAnime(id: number): Promise<Card> {
        const query = `
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

        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    id,
                },
            }),
        });
        const data = await response.json();

        return new Card(
            data.data.Media.id,
            data.data.Media.title.userPreferred,
            `${capitalizeFirstLetter(data.data.Media.format)} - ${
                data.data.Media.episodes > 1
                    ? `${data.data.Media.episodes} episodes`
                    : Math.floor(data.data.Media.duration / 60) > 0
                    ? `${Math.floor(data.data.Media.duration / 60)} hrs ${
                          data.data.Media.duration % 60
                      } min`
                    : `${data.data.Media.duration % 60} minutes`
            } - ${capitalizeFirstLetter(data.data.Media.status)}`,
            `${capitalizeFirstLetter(data.data.Media.season)} ${
                data.data.Media.seasonYear
            }`,
            data.data.Media.genres,
            data.data.Media.coverImage.extraLarge,
            data.data.Media.coverImage.color
        );
    }
}

export class MyAnimeList extends Wrapper {
    url = "https://api.jikan.moe/v4";

    async getAnime(id: number): Promise<Card> {
        const response = await fetch(this.url + "/anime/" + id + "/full");
        const data = await response.json();

        return new Card(
            data.mal_id,
            data.title,
            `${data.type} - ${
                data.episodes > 1
                    ? `${data.episodes} episodes`
                    : Math.floor(data.duration / 60) > 0
                    ? `${Math.floor(data.duration / 60)} hrs ${
                          data.duration % 60
                      } min`
                    : `${data.duration % 60} minutes`
            } - ${data.status}`,
            `${capitalizeFirstLetter(data.season)} ${data.year}`,
            Array.from(data.genres.map((v, i) => v.name)),
            data.images.webp.large_image_url,
            getMiddleShade(rgbToHex(await getColor(data.images.jpg.image_url)))
        );
    }
}

const wrapper_codes = {
    anilist: AniList,
    myanimelist: MyAnimeList,
};

export default class API {
    wrapper: any;

    constructor(wrapper_code: string) {
        this.wrapper = new wrapper_codes[wrapper_code]();
    }

    async getAnime(id: any): Promise<Card> {
        return await this.wrapper.getAnime(id);
    }
}

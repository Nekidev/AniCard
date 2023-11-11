import { capitalizeFirstLetter, rgbToHex } from "@/utils";
import { getQuery } from "@/utils/queries";

import ColorThief from "@/lib/colorthief";

export type ExtraCode = "characters" | "staff" | "studio";

interface Labels {
    title: string;
    subtitle: string;
}

export class Extra {
    code: ExtraCode;
    type: "images" | "card" | "labels";
    data: Array<string> | Card | Labels;

    constructor(
        code: ExtraCode,
        type: "images" | "card" | "labels",
        data: Array<string> | Card | Labels
    ) {
        this.code = code;
        this.type = type;
        this.data = data;
    }
}

class Card {
    id: string | number;
    title: string;
    subtitle: string | null = null;
    label: string | null = null;
    tags: Array<string> | null = null;
    imageUrl: string | null = null;
    color: string | null = null;
    extras: Array<Extra> = [];

    constructor({
        id,
        title,
        subtitle = null,
        label = null,
        tags = null,
        imageUrl = null,
        color = null,
        extras = [],
    }: {
        id: number | string;
        title: string;
        subtitle?: string;
        label?: string;
        tags?: Array<string>;
        imageUrl?: string;
        color?: string;
        extras?: Array<Extra>;
    }) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.label = label;
        this.tags = tags;
        this.imageUrl = imageUrl;
        this.color = color;
        this.extras = extras;
    }
}

class Wrapper {
    url: string;

    async getAnime(id: number | string): Promise<Card> {
        throw new Error("Method not implemented.");
    }
}

export class AniList extends Wrapper {
    url = "https://graphql.anilist.co";

    async getAnime(id: string): Promise<Card> {
        const query = getQuery("anilist-anime");

        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    id: Number(id),
                },
            }),
        });
        const data = await response.json();

        return new Card({
            id: data.data.Media.id,
            title: data.data.Media.title.userPreferred,
            subtitle: `${capitalizeFirstLetter(
                data.data.Media.format.replace("_", " ")
            )} - ${
                data.data.Media.episodes > 1
                    ? `${data.data.Media.episodes} episodes`
                    : Math.floor(data.data.Media.duration / 60) > 0
                    ? `${Math.floor(data.data.Media.duration / 60)} hrs ${
                          data.data.Media.duration % 60
                      } min`
                    : `${data.data.Media.duration % 60} minutes`
            } - ${capitalizeFirstLetter(data.data.Media.status)}`,
            label: `${capitalizeFirstLetter(data.data.Media.season)} ${
                data.data.Media.seasonYear
            }`,
            tags: data.data.Media.genres,
            imageUrl: data.data.Media.coverImage.extraLarge,
            color: data.data.Media.coverImage.color,
            extras: [
                new Extra(
                    "characters",
                    "images",
                    Array.from(
                        data.data.Media.characters.edges.map(
                            (v: any) => v.node.image.large
                        ).slice(0, 10)
                    )
                ),
                new Extra(
                    "staff",
                    "images",
                    Array.from(
                        data.data.Media.staff.edges.map(
                            (v: any) => v.node.image.large
                        ).slice(0, 10)
                    )
                ),
                new Extra("studio", "labels", {
                    title: Array.from(
                        data.data.Media.studios.edges.map(
                            (v: any) => v.node.name
                        )
                    ).join(", "),
                    subtitle:
                        Array.from(
                            data.data.Media.staff.edges.filter(
                                (v: any) => v.role.toLowerCase() == "director"
                            )
                        ).length > 0
                            ? `Directed by ${Array.from(
                                  data.data.Media.staff.edges
                                      .filter(
                                          (v: any) =>
                                              v.role.toLowerCase() == "director"
                                      )
                                      .map((v: any) => v.node.name.full)
                              ).join(", ")}`
                            : "Unknown director(s)",
                }),
            ],
        });
    }
}

export class MyAnimeList extends Wrapper {
    url = "https://api.jikan.moe/v4";

    async getAnimeCharacters(id: string): Promise<Array<string>> {
        const response = await fetch(this.url + "/anime/" + id + "/characters");
        const data = (await response.json()).data;

        return data;
    }

    async getAnimeStaff(id: string): Promise<Array<string>> {
        const response = await fetch(this.url + "/anime/" + id + "/staff");
        const data = (await response.json()).data;

        return data;
    }

    async getAnime(id: string): Promise<Card> {
        const response = await fetch(this.url + "/anime/" + id + "/full");
        const data = (await response.json()).data;

        const characters = await this.getAnimeCharacters(id);
        const staff = await this.getAnimeStaff(id);

        return new Card({
            id: data.mal_id,
            title: data.title,
            subtitle: `${data.type} - ${
                data.episodes > 1
                    ? `${data.episodes} episodes`
                    : Math.floor(data.duration / 60) > 0
                    ? `${Math.floor(data.duration / 60)} hrs ${
                          data.duration % 60
                      } min`
                    : `${data.duration % 60} minutes`
            } - ${data.status}`,
            label: `${capitalizeFirstLetter(data.season)} ${data.year}`,
            tags: Array.from(
                data.genres.map((v: { name: string }, i: number) => v.name)
            ),
            imageUrl: data.images.webp.large_image_url,
            color: rgbToHex(
                await ColorThief.getColor(data.images.jpg.image_url)
            ),
            extras: [
                new Extra(
                    "characters",
                    "images",
                    Array.from(
                        characters.map(
                            (v: any) => v.character.images.webp.image_url
                        ).slice(0, 10)
                    )
                ),
                new Extra(
                    "staff",
                    "images",
                    Array.from(
                        staff.map((v: any) => v.person.images.jpg.image_url).slice(0, 10)
                    )
                ),
                new Extra("studio", "labels", {
                    title: Array.from(
                        data.studios.map((v: any) => v.name)
                    ).join(", "),
                    subtitle:
                        Array.from(
                            staff.filter((v: any) =>
                                v.positions
                                    .map((j: string) => j.toLowerCase())
                                    .includes("director")
                            )
                        ).length > 0
                            ? `Directed by ${Array.from(
                                staff.filter((v: any) =>
                                v.positions
                                    .map((j: string) => j.toLowerCase())
                                    .includes("director")
                            )
                              )
                                  .map((v: any) => v.person.name.split(", ").reverse().join(" "))
                                  .join(", ")}`
                            : "Unknown director(s)",
                }),
            ],
        });
    }
}

const wrapper_codes = {
    anilist: AniList,
    myanimelist: MyAnimeList,
};
export type WrapperCode = "myanimelist" | "anilist";

export default class API {
    wrapper: any;

    constructor(wrapper_code: WrapperCode) {
        this.wrapper = new wrapper_codes[wrapper_code]();
    }

    validWrapper(wrapper_code: WrapperCode): boolean {
        return wrapper_code in wrapper_codes;
    }

    async getAnime(id: number | string): Promise<Card> {
        return await this.wrapper.getAnime(id);
    }
}

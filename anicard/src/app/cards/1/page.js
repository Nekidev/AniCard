/*
Vertical card with poster.
*/

"use client";

import { Merriweather, Rubik, Roboto_Mono } from "next/font/google";

import { useSearchParams } from "next/navigation";

import { hexToHsl } from "@/utils";

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["900"],
});

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400"],
});

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    const searchParams = useSearchParams();

    const color = hexToHsl(searchParams.get("color"));
    const hslColor = `hsl(${color[0]},${color[1]}%,90%)`;

    const extra = searchParams.get("extra")
        ? JSON.parse(searchParams.get("extra"))
        : null;

    return (
        <main className={rubik.className}>
            <img src={searchParams.get("image_url")} className="w-full" />
            <div
                class="p-8 flex flex-col gap-16 text-black/80"
                style={{
                    background: `hsl(${color[0]}, ${color[1]}%, 90%)`,
                }}
            >
                <div className="flex flex-col gap-2">
                    <span className={"text-base " + roboto_mono.className}>
                        {searchParams.get("label")}
                    </span>
                    <h1
                        className={
                            "font-black text-5xl " + merriweather.className
                        }
                    >
                        {searchParams.get("title")}
                    </h1>
                    <p className="text-2xl">{searchParams.get("subtitle")}</p>
                </div>
                <div className="flex flex-col gap-8">
                    {extra && extra.type == "labels" && (
                        <div
                            className="flex flex-col items-start gap-2 p-4 rounded-xl text-2xl leading-none"
                            style={{
                                backgroundColor: `hsl(${color[0]},${color[1]}%,85%)`,
                            }}
                        >
                            <div className="font-bold">{extra.data.title}</div>
                            <div>{extra.data.subtitle}</div>
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-4 flex-wrap">
                        {searchParams
                            .get("tags")
                            .split(",")
                            .map((tag) => (
                                <Tag title={tag} />
                            ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function Tag({ title }) {
    return (
        <div className="py-2 px-4 rounded-full border border-black/80 leading-none text-xl">
            {title}
        </div>
    );
}

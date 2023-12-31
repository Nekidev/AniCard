/*
Vertical card with poster.
*/

"use client";

import { Merriweather, Rubik, Roboto_Mono } from "next/font/google";

import { useSearchParams } from "next/navigation";

import { hexToHsl } from "@/utils";
import React from "react";

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["900"],
});

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
});

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    const searchParams = useSearchParams();

    var color = hexToHsl(searchParams.get("color"));
    const hslColor = `hsl(${color[0]},${color[1]}%,90%)`;

    const extra = searchParams.get("extra")
        ? JSON.parse(searchParams.get("extra"))
        : null;

    return (
        <main className={rubik.className + " w-full flex flex-row relative"}>
            <img
                src={searchParams.get("image_url")}
                className="h-screen min-h-full max-h-screen"
            />
            <div
                class="p-8 flex flex-col gap-8 flex-1 h-screen max-h-screen justify-between relative"
                style={{
                    background: hslColor,
                }}
            >
                <div className="flex flex-col gap-2 text-black/80">
                    <span className={"text-lg " + roboto_mono.className}>
                        {searchParams.get("label")}
                    </span>
                    <h1
                        className={
                            "font-black text-5xl " + merriweather.className
                        }
                    >
                        {searchParams.get("title")}
                    </h1>
                    <p className="text-3xl">{searchParams.get("subtitle")}</p>
                </div>
                <div className="flex flex-col gap-8 shrink min-h-0">
                    {extra && extra.type == "images" && (
                        <div className="flex flex-row shrink min-h-0 w-full relative">
                            <div className="flex flex-row gap-4 max-w-full overflow-hidden max-h-44 relative flex-1 min-h-0 flex-wrap">
                                {extra.data.map((imageUrl, index) => (
                                    <img
                                        className="rounded-lg max-h-full h-full object-cover object-center block"
                                        src={imageUrl}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {extra && extra.type == "labels" && (
                        <div className="flex flex-row items-center gap-8 py-4 px-8 rounded-xl text-2xl leading-none w-fit" style={{
                            backgroundColor: `hsl(${color[0]},${color[1]}%,85%)`
                        }}>
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
        <div className="py-2 px-4 rounded-full border border-black/80 leading-none text-2xl">
            {title}
        </div>
    );
}

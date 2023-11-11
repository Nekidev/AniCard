/*
Vertical card with poster.
*/

"use client";

import { Merriweather, Rubik, Roboto_Mono } from "next/font/google";

import { useSearchParams } from "next/navigation";

import { adjustBrightness } from "@/utils";

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

    return (
        <main className={rubik.className}>
            <img src={searchParams.get("image_url")} className="w-full" />
            <div
                class="p-8 flex flex-col gap-16 text-black/80"
                style={{
                    background: adjustBrightness(
                        searchParams.get("bg_color"),
                        170
                    ),
                }}
            >
                <div className="flex flex-col gap-2">
                    <span className={"text-base " + roboto_mono.className}>
                        {searchParams.get("season")}
                    </span>
                    <h1
                        className={
                            "font-black text-5xl " + merriweather.className
                        }
                    >
                        {searchParams.get("title")}
                    </h1>
                    <p className="text-2xl">
                        {searchParams.get("type")} -{" "}
                        {searchParams.get("duration")} -{" "}
                        {searchParams.get("status")}
                    </p>
                </div>
                <div className="flex flex-row items-center gap-4 flex-wrap">
                    {searchParams
                        .get("genres")
                        .split(",")
                        .map((genre) => (
                            <Genre title={genre} />
                        ))}
                </div>
            </div>
        </main>
    );
}

function Genre({ title }) {
    return (
        <div className="py-2 px-4 rounded-full border border-black/80 leading-none text-xl">
            {title}
        </div>
    );
}

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
                    <p className="text-2xl">
                        {searchParams.get("subtitle")}
                    </p>
                </div>
                <div className="flex flex-row items-center gap-4 flex-wrap">
                    {searchParams
                        .get("tags")
                        .split(",")
                        .map((tag) => (
                            <Tag title={tag} />
                        ))}
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

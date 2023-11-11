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

    var color = hexToHsl(searchParams.get("color"));
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
                class="p-8 flex flex-col flex-1 h-screen justify-between relative"
                style={{
                    background: `hsl(${color[0]}, ${color[1]}%, 90%)`,
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
                <div className="flex flex-col gap-8">
                    {extra.type == "images" && (
                        <div className="flex flex-row gap-4 max-w-full overflow-hidden max-h-44 aspect-[2/3]">
                            {extra.data.slice(0, 6).map((imageUrl, index) => (
                                <img
                                    className="rounded-lg h-full object-cover object-center"
                                    src={imageUrl}
                                    key={index}
                                />
                            ))}
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

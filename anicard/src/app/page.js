"use client";

import { Rubik, Roboto_Mono } from "next/font/google";
import Link from "next/link";

import React from "react";

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
});

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    const idRef = React.useRef();
    const styleRef = React.useRef();
    const [extra, setExtra] = React.useState(null);

    const [imageUrl, setImageUrl] = React.useState(null);

    const generate = () => {
        setImageUrl(
            `https://card.nyeki.dev/api/card?id=${idRef.current.value}&style=${
                styleRef.current.value
            }&extra=${extra || ""}`
        );
    };

    return (
        <main
            className={
                rubik.className +
                " bg-neutral-50 min-h-screen text-black/80 flex flex-col items-center py-16 px-8 relative"
            }
        >
            <div className="w-full max-w-lg flex flex-col gap-8 relative">
                <div>
                    <h1 className="text-3xl font-bold">AniCard</h1>
                    <p>
                        Create nice and customizable informational cards for any
                        anime!
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="relative flex flex-row items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            placeholder="AniList anime ID"
                            className={
                                "border border-neutral-100 drop-shadow-sm p-2 rounded leading-none flex-1 " +
                                roboto_mono.className
                            }
                            defaultValue={104157}
                            ref={idRef}
                        />
                        <select
                            className="border border-neutral-100 drop-shadow-sm p-2 rounded leading-none"
                            ref={styleRef}
                            defaultValue={"2"}
                        >
                            <option value="1">Vertical</option>
                            <option value="2">Horizontal</option>
                        </select>
                        <button
                            className="rounded p-2 bg-neutral-200 leading-none hover:bg-neutral-300 transition drop-shadow-sm h-full border border-neutral-300"
                            onClick={generate}
                        >
                            Generate
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <span className="font-bold">Extra:</span>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="extra"
                                value={null}
                                id="extra-none"
                                defaultChecked
                                onChange={(value) => {
                                    if (value) {
                                        setExtra(null);
                                    }
                                }}
                            />
                            <label htmlFor="extra-none">None</label>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="extra"
                                value={"characters"}
                                id="extra-characters"
                                onChange={(value) => {
                                    if (value) {
                                        setExtra("characters");
                                    }
                                }}
                            />
                            <label htmlFor="extra-characters">Characters</label>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="extra"
                                value={"staff"}
                                id="extra-staff"
                                onChange={(value) => {
                                    if (value) {
                                        setExtra("staff");
                                    }
                                }}
                            />
                            <label htmlFor="extra-staff">Staff</label>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="extra"
                                value={"studio"}
                                id="extra-studio"
                                onChange={(value) => {
                                    if (value) {
                                        setExtra("studio");
                                    }
                                }}
                            />
                            <label htmlFor="extra-studio">Studio</label>
                        </div>
                    </div>
                </div>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        className="w-full"
                        onError={() => {
                            setImageUrl(null);
                            alert(
                                "Looks like there was an error generating this image! Are you sure the ID is correct? Mangas are not supported ATM."
                            );
                        }}
                    />
                ) : (
                    <div className="border-2 border-dashed border-neutral-300 p-8 text-center rounded">
                        Click on{" "}
                        <button
                            className="p-1 -my-1 rounded bg-neutral-200 transition hover:bg-neutral-300 leading-none border border-neutral-300"
                            onClick={generate}
                        >
                            Generate
                        </button>{" "}
                        to generate your card.
                    </div>
                )}
                <div></div>
                <div>
                    <h2 className="text-2xl font-bold">Rest API</h2>
                    <p>You can use this API to dynamically generate cards.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold">Endpoint:</span>
                    <div className="relative w-full">
                        <div
                            className={
                                "bg-white text-sm border border-neutral-100 drop-shadow-sm p-2 rounded leading-none flex-1 select-all " +
                                roboto_mono.className
                            }
                        >
                            GET https://card.nyeki.dev/api/card
                        </div>
                        <Link
                            href="https://card.nyeki.dev/api/card"
                            className="absolute top-0 bottom-0 right-2 my-auto transition text-neutral-500 hover:text-neutral-700 p-2 -m-2"
                            title="Open in a new tab"
                            target="_blank"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="font-bold">Query parameters:</span>
                    <QueryParameter
                        name="?id="
                        description="The ID of the anime."
                        type="Number"
                    />
                    <QueryParameter
                        name="?source="
                        description="The source where to get the anime details from. Options: `anilist`, `myanimelist`."
                        type="String"
                    />
                    <QueryParameter
                        name="?style="
                        description="The card style/version. Options: `1`, `2`."
                        type="Number"
                    />
                    <QueryParameter
                        name="?extra="
                        description="An extra component to add to the card. Options: `characters`, `staff`, `studio`."
                        type="String"
                    />
                </div>
                <div className="h-px bg-neutral-300 my-8"></div>
                <div className="flex flex-row items-center justify-between">
                    <Link
                        href="https://nyeki.dev"
                        className="underline hover:no-underline"
                        target="_blank"
                    >
                        Made by Nyeki.py
                    </Link>
                    <Link
                        href="https://ko-fi.com/nekidev"
                        className="underline hover:no-underline"
                        target="_blank"
                    >
                        Donate
                    </Link>
                </div>
            </div>
        </main>
    );
}

function QueryParameter({ name, description, type }) {
    return (
        <div className="flex flex-row items-start gap-2 text-sm">
            <span
                className={
                    roboto_mono.className +
                    " p-1 -my-1 rounded bg-neutral-200 leading-none border border-neutral-300 whitespace-nowrap w-20 shrink-0"
                }
            >
                {name}
            </span>
            {description}
            <div className="flex-1 h-px bg-neutral-200 mx-2 mt-2.5"></div>
            <div className={roboto_mono.className}>{type}</div>
        </div>
    );
}

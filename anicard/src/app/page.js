import { Merriweather, Rubik } from "next/font/google";


const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["900"],
})

const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400"],
})


export default function Home() {
    return (
        <main className={rubik.className}>
            <img
                src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130003-5Y8rYzg982sq.png"
                className="w-full"
            />
            <div class="p-4 flex flex-col bg-[#ffffd2]">
                <span className="text-sm text-black/90">2022</span>
                <h1 className={"font-black text-3xl text-black/90 " + merriweather.className}>Bocchi the Rock!</h1>
                <p className="text-lg text-black/90">TV - 12 Episodes - Finished</p>
                <div className="h-8"></div>
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    <Genre title="Comedy" />
                    <Genre title="Music" />
                    <Genre title="Slice of life" />
                </div>
            </div>
        </main>
    );
}

function Genre({ title }) {
    return (
        <div className="p-2 rounded-lg leading-none text-black/90 bg-black/5">
            {title}
        </div>
    );
}

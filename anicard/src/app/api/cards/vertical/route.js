import { randomString, capitalizeFirstLetter } from "@/utils";

// import chrome from "chrome-aws-lambda";
// import puppeteer from "puppeteer-core";

async function screenshot(url, viewport, selector) {
    const options = process.env.AWS_REGION
        ? {
              args: chrome.args,
              executablePath: await chrome.executablePath,
              headless: chrome.headless,
          }
        : {
              args: [],
              executablePath:
                  process.platform === "win32"
                      ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
                      : process.platform === "linux"
                      ? "/usr/bin/google-chrome"
                      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    const image = await element.screenshot({ type: "png", quality: 100 });
    await browser.close();
    return image;
}

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

    console.log(data)

    const url = `https://ani-card.vercel.app/cards/vertical?image_url=${encodeURIComponent(
        data.data.Media.coverImage.extraLarge
    )}&bg_color=${encodeURIComponent(
        data.data.Media.coverImage.color
    )}&season=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.season.toLowerCase()) +
            " " +
            data.data.Media.seasonYear
    )}&title=${encodeURIComponent(
        data.data.Media.title.userPreferred
    )}&type=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.format.toLowerCase())
    )}&duration=${encodeURIComponent(
        data.data.Media.episodes > 1
            ? `${data.data.Media.episodes} episodes`
            : `${data.data.Media.duration} min`
    )}&source=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.source.toLowerCase())
    )}&genres=${encodeURIComponent(data.data.Media.genres.join(","))}&status=${encodeURIComponent(
        capitalizeFirstLetter(data.data.Media.status.toLowerCase())
    )}`;
    console.log(url);

    const image = await screenshot(url, { width: 1200, height: 3600 }, "#card");

    const res = new Response(image);
    res.setHeader("Content-Type", "image/png");
    return res;
}

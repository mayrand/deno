import { PullParser } from "https://deno.land/x/xmlp/mod.ts";

// create a pull parser instance
const parser = new PullParser();

// create an ES6 generator
const uint8Array = await Deno.readFile(
//   ".\\BookmarksDuplicatesRemover\\bookmarks_27.07.2021.html",
//   ".\\BookmarksDuplicatesRemover\\note.xml",
  "note.xml",
);
const events = parser.parse(uint8Array);

// pull events, using iterator
const event = events.next();
if (event.value) {
    console.log(event.value.name);
}

// using spread operator
console.log([...events].filter(({ name }) => {
    return name === 'text';
}).map(({ text, cdata }) => {
    return cdata ? `<![CDATA[${text}]]>` : text;
}));

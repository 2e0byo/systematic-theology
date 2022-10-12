const bibcards = document.getElementById("bib-container");

const urlMapping = {
    "archive.org": "Archive",
    "stmarys.summon.serialssolutions.com": "St. Marys",
    "www.google.co.uk": "Google",
    "academic.oup.com": "OUP",
};

const formatEntry = e => typeof(e) === "object"? e.join(", "): e;

const createCard = (obj) => {
    const div = document.createElement("div");
    div.className = "card";

    const author = obj.Author? obj.Author : obj.Editor? obj.Editor: "";
    let header = `
<header>
<div class="row is-marginless">
  <div class="col-8 is marginless">
     <h4>${obj.Title}</h4>
  </div>
  <div class="col-4 text-right">${author}</div>
`;
    if (obj.Subtitle) {
        header += `
<div class="col is-marginless">
   <h5>${obj.Subtitle}</h5>
</div>
`;
    }
    header += "</div></header>";

    div.innerHTML = header;

    const contents = document.createElement("div");
    contents.className = "multicol";

    if (obj["Url"]) {
        const url = new URL(obj["Url"]);
        const host = url.hostname;
        const k = obj.Online? "Available Online": "Not Available Online";
        const mapped = urlMapping[host] ? urlMapping[host] : "Other";
        obj[k] = `<a href="${url}">${mapped}</a>`;
    }
    let keys = [...Object.keys(obj)].filter((x) => obj[x]);
    keys.sort();
    if (keys.includes("Notes")) {
        keys = keys.filter((x) => x !== "Notes");
        keys.push("Notes");
    }
    const skip = ["Title", "Subtitle", "Url", "Author", "Online"];

    keys
        .filter((k) => {return !skip.includes(k);})
        .forEach((k) => {
            const innerDiv = document.createElement("div");
            innerDiv.setAttribute("data-attr", k);
            innerDiv.innerHTML = obj[k] ? `${k}:&nbsp;<span>${formatEntry(obj[k])}</span>` : "";
            contents.appendChild(innerDiv);
        });
    div.appendChild(contents);
    return div;
}

const setCardsContent = (data) => {
    data.map((obj) => {
        bibcards.appendChild(createCard(obj));
    });
}

async function loadData() {
    const resp = await fetch("bib.json");
    let data = await resp.json();
    const rclasses = await fetch("classes.json");
    const classes = await rclasses.json();

    data.map((r) => {
        r.Classes = r.Classes.map((x) => {
            if (classes[x] === undefined) {
                console.log("Failed to find class", x, "in classes", classes);
                return "";
            } else {
                return classes[x];
            }});
    });
    return data;
}

const buttons = document.querySelectorAll("button");

const sortData = (data, by, ascending=true) => {
    bibcards.innerHTML = "";
    const others = data.filter((x) => {return x[by] === undefined;});
    let sorted = [...data]
        .filter((x) => x[by] !== undefined)
        .sort((a, b) => {
            return (a[by] > b[by]) ? -1 : (a[by] < b[by]) ? 1 : 0;
        });
    if (!ascending) { sorted.reverse();}
    setCardsContent([...sorted, ...others]);
}

const resetButtons = (e) => {
    [...buttons].map((btn) => {
        if (btn !== e.target) {
            btn.removeAttribute("data-dir");
            btn.className = "button outline";
        } else {
            btn.className = "button";
        }
    });
};

async function onLoad() {
    const data = await loadData();
    setCardsContent(data);

    [...buttons].map((btn) => {
        btn.className = "button outline";
        btn.addEventListener("click", (e) => {
            resetButtons(e);
            if (e.target.getAttribute("data-dir") === "asc") {
                sortData(data, e.target.id, false);
                e.target.setAttribute("data-dir", "desc");
            } else {
                sortData(data, e.target.id, true);
                e.target.setAttribute("data-dir", "asc");
            }
        });
    });
}

window.addEventListener("load", onLoad);

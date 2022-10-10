const bibtbl = document.getElementById("bib-table-content");
const bibcards = document.getElementById("bib-container");

const urlMapping = {
    "archive.org": "Archive",
    "stmarys.summon.serialssolutions.com": "St. Marys",
    "www.google.co.uk": "Google",
    "academic.oup.com": "OUP",
};

const createCard = (obj) => {
    const div = document.createElement("div");
    div.className = "card";

    const author = obj.Author? obj.Author : obj.Editor;
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

    const contents = document.createElement("div")
    contents.className = "multicol";

    if (obj["Url"]) {
        const url = new URL(obj["Url"]);
        const host = url.hostname;
        console.log(host);
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
    const skip = ["Title", "Subtitle", "Url", "Author"];

    console.log(obj);
    keys
        .filter((k) => {return !skip.includes(k);})
        .forEach((k) => {
            const innerDiv = document.createElement("div");
            innerDiv.setAttribute("data-attr", k);
            innerDiv.innerHTML = obj[k] ? `${k}:&nbsp;<span>${obj[k]}</span>` : "";
            contents.appendChild(innerDiv);
        });
    div.appendChild(contents);
    return div;
}

const createRow = (obj) => {
    const row = document.createElement("tr");
    if (obj["url"]) {
        const url = new URL(obj["url"]);
        const host = url.hostname;
        obj["href"] = `<a href="${url}">${urlMapping[host]}</a>`;
    }
    const headers = [...document.getElementById("header").children];
    headers.forEach((h) => {
        const id = h.firstChild.id;
        const cell = document.createElement("td");
        cell.setAttribute("data-attr", id);
        cell.innerHTML = obj[id] ? obj[id] : "";
        row.appendChild(cell);
    });
    return row;
}

const setTblContent = (data) => {
    data.map((obj) => {
        bibtbl.appendChild(createRow(obj));
    });
}

const setCardsContent = (data) => {
    data.map((obj) => {
        bibcards.appendChild(createCard(obj));
    });
}

async function loadData() {
    const resp = await fetch("bib.json");
    return await resp.json();
}

const buttons = document.querySelectorAll("th button");

const sortData = (data, by, ascending=true) => {
    bibtbl.innerHTML = "";
    const others = data.filter((x) => {return x[by] === undefined;});
    let sorted = [...data]
        .filter((x) => x[by] !== undefined)
        .sort((a, b) => {
            return (a[by] > b[by]) ? -1 : (a[by] < b[by]) ? 1 : 0;
        });
    if (!ascending) { sorted.reverse();}
    setTblContent([...sorted, ...others]);
}

const resetButtons = (e) => {
    [...buttons].map((btn) => {
        if (btn !== e.target) {
            btn.removeAttribute("data-dir");
        }
    });
};

async function onLoad() {
    const data = await loadData();
    setTblContent(data);
    setCardsContent(data);

    [...buttons].map((btn) => {
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

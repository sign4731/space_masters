let elementer;
let filter = "alle";
document.addEventListener("DOMContentLoaded", loadJSON)


async function loadJSON() {
    const JSONData = await
    fetch("https://spreadsheets.google.com/feeds/list/1aOS0jQwtGNCqUas4pGKq8i8JmW_7cW9ie0q39bRcHLM/od6/public/values?alt=json");
    elementer = await JSONData.json();
    addEventListenersToButtons();
    visElementer();
}

function visElementer() {
    const templatePointer = document.querySelector("template");
    const sectionPointer = document.querySelector("#listeview");
    sectionPointer.innerHTML = "";
    elementer.feed.entry.forEach(element => {
        if (filter == "alle" || filter == element.gsx$kategori.$t) {
            console.log(element);
            const klon = templatePointer.cloneNode(true).content;
            klon.querySelector(".navn").textContent = element.gsx$navn.$t;
            klon.querySelector("img").src = "assets/" + element.gsx$billede.$t + ".png";

            klon.querySelector("#info").addEventListener("click", () => visDetaljer(element));
            sectionPointer.appendChild(klon);
        }
    })

}


function visDetaljer(element) {
    console.log(element);
    popup.querySelector(".popup_navn").textContent = element.gsx$navn.$t;
    popup.querySelector(".popup_kategori").textContent = element.gsx$kategori.$t;
    popup.querySelector(".popup_img").src = "assets/" + element.gsx$billede.$t + ".png";
    popup.querySelector(".popup_beskrivelse").textContent = element.gsx$beskrivelse.$t;

    popup.style.display = "block";

}

function addEventListenersToButtons() {
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.addEventListener("click", filterBTNs);
    });
}

function filterBTNs() {
    filter = this.dataset.kategori;
    document.querySelector("h1").textContent = this.textContent;
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.classList.remove("valgt");
    })
    this.classList.add("valgt");
    visElementer()
}

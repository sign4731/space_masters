//variabel deklaration af vores elementer og så vi kan filtrere
let elementer;
let filter = "alle";

//gå til loadjson functionen når dokumendet er loadet
document.addEventListener("DOMContentLoaded", loadJSON)


// denne function loader indholdet fra googlesheetet vha json
async function loadJSON() {
    const JSONData = await
    fetch("https://spreadsheets.google.com/feeds/list/1aOS0jQwtGNCqUas4pGKq8i8JmW_7cW9ie0q39bRcHLM/od6/public/values?alt=json");
    elementer = await JSONData.json();

    //sætter eventlisteners på filtreringsknapperne, så den filtrerer i indholdet
    addEventListenersToButtons();

    //gå til vis elementer
    visElementer();
}

function visElementer() {
    //deklaration af constanter så vi kan kopiere indhold fra template til section#listeview
    const templatePointer = document.querySelector("template");
    const sectionPointer = document.querySelector("#listeview");
    sectionPointer.innerHTML = "";

    //henter navn + billede til vores listeview alt efter hvordan det er filtreret
    elementer.feed.entry.forEach(element => {
        if (filter == "alle" || filter == element.gsx$kategori.$t) {
            console.log(element);
            const klon = templatePointer.cloneNode(true).content;
            klon.querySelector(".navn").textContent = element.gsx$navn.$t;
            klon.querySelector("img").src = "assets/" + element.gsx$billede.$t + ".png";

            //åbner popup visning når man trykker på informationsknappen
            klon.querySelector("#info").addEventListener("click", () => visDetaljer(element));

            //lægger det klonede ind som child til vores section
            sectionPointer.appendChild(klon);
        }
    })

}

//lukker popup vinduet når man trykker på luk-knappen
document.querySelector("#luk").addEventListener("click", () => popup.style.display = "none");

//functionen henter infomation til popup viewet
function visDetaljer(element) {
    console.log(element);
    popup.querySelector(".popup_navn").textContent = element.gsx$navn.$t;
    popup.querySelector(".popup_kategori").textContent = element.gsx$kategori.$t;
    popup.querySelector(".popup_img").src = "assets/" + element.gsx$billede.$t + ".png";
    popup.querySelector(".popup_beskrivelse").textContent = element.gsx$beskrivelse.$t;

    popup.style.display = "block";

}

//så man kan filtrere når knappen trykkes på -> går til filter functionen
function addEventListenersToButtons() {
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.addEventListener("click", filterBTNs);
    });
}

//viser det info man har filtreret efter + ændrer overskriften til det valgte filter
function filterBTNs() {
    filter = this.dataset.kategori;
    document.querySelector("#overskrift").textContent = this.textContent;
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.classList.remove("valgt");
    })
    this.classList.add("valgt");
    visElementer()
}

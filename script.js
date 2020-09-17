//variabel deklaration af vores elementer og så vi kan filtrere
let elementer;
let filter = "alle";

//gå til loadjson functionen når dokumendet er loadet
document.addEventListener("DOMContentLoaded", loadJSON)

//siden vises, musik starter
document.querySelector("#lyd").play();

// denne function loader indholdet fra googlesheetet vha json
async function loadJSON() {
    const JSONData = await
    fetch("https://spreadsheets.google.com/feeds/list/1aOS0jQwtGNCqUas4pGKq8i8JmW_7cW9ie0q39bRcHLM/od6/public/values?alt=json");
    elementer = await JSONData.json();

    //sætter eventlisteners på filtreringsknapperne, så den filtrerer i indholdet
    addEventListenersToButtons();

    //gå til vis elementer
    visElementer();

    //menuknap
    document.querySelector("#menuknap").addEventListener("click", toggleMenu);

    //gå til startStjerneskud1
    startStjerneskud1()



}

function startStjerneskud1() {
    console.log("startStjerneskud1");
    //begynd animation på stjerneskud 1
    document.querySelector("#stjerneskud1_container").classList.add("flyv1");

    //animation stjerneskud 1 done
    document.querySelector("#stjerneskud1_container").addEventListener("animationend", startTid1);

    //fjern igangværende animation
    //    document.querySelector("#stjerneskud2_container").classList.remove("flyv2");
}


function startStjerneskud2() {
    console.log("startStjerneskud2");

    //fjern nuværende animation
    //    this.classList.remove("flyv1");

    //start animation på stjerneskud 2
    document.querySelector("#stjerneskud2_container").classList.add("flyv2");

    //animation stjerneskud 2 done
    document.querySelector("#stjerneskud2_container").addEventListener("animationend", startTid2);
}

function startTid1() {
    console.log("startTid1");
    //fjern class fra stjerne 1
    document.querySelector("#stjerneskud1_container").classList.remove("flyv1");

    //fjerne lytteren på stjerne 1 og start tiden
    document.querySelector("#stjerneskud1_container").removeEventListener("animationend", startTid1);

    //tid, derefter videre til næste stjerne
    setTimeout(startStjerneskud2, 1000);
}

function startTid2() {
    console.log("startTid2");
    //fjern class fra stjerne 2
    document.querySelector("#stjerneskud2_container").classList.remove("flyv2");

    //fjerne lytteren på stjerne 2 og start tiden
    this.removeEventListener("animationend", startTid2);

    //tid, derefter videre til næste stjerne
    setTimeout(startStjerneskud1, 1000);
}

//basic burgermenu
function toggleMenu() {
    document.querySelector("#menu").classList.toggle("hidden");

    let erSkjult = document.querySelector("#menu").classList.contains("hidden");

    if (erSkjult == true) {
        document.querySelector("#menuknap").textContent = "☰";
    } else {
        document.querySelector("#menuknap").textContent = "x";
    }

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

    //vider vinduet - fremfor display:none
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
    toggleMenu()
}

// erklæring af variabler, sætter konstante variabler til at være lig containere, loader Json på DOMload.
let retter;

let kategori = "alle";

var slideIndex = 0;

const container = document.querySelector(".data-container");

const temp = document.querySelector("template");

const article = document.querySelector(".enkeltperson");

// hvis dom er loaded, kaldes getJson
document.addEventListener("DOMContentLoaded", getJson);

// Erklærer JsonData til vores google sheeet, sætter eventlisterningers på burgermenu og på mad-kategori billederne på forsiden.

async function getJson() {

    let jsonData = await fetch("https://spreadsheets.google.com/feeds/list/1cefgRhGLAPtoKEFyd5789ovjTWE4wHkzxEAenmD291M/od6/public/values?alt=json");
    console.log("jsonData", jsonData);

    retter = await jsonData.json();

    console.log("retter", retter);

    document.querySelector(".burgermenu").addEventListener("click", toggleMenu);

    carousel();
    addEventListenerToButtons();
    addEventListenerToresetMenu();
    menuForside();
    footer();

};

// Splash billede MySlides function der skifter billede efter tid. //

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) {
        slideIndex = 1
    }
    x[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 5000); // Change image every 5 seconds
}

// Sætter EVL på alle elementer med classen "filter", så de kalder funktionen "filtrering" ved click

function addEventListenerToButtons() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtrering);
    })
}

// Sætter EVL på alle elementer med classen "resetMenu", så de kalder funktionen "Resetmenuen" ved click


function addEventListenerToresetMenu() {
    document.querySelectorAll(".resetMenu").forEach(elm => {
        elm.addEventListener("click", ResetMenuen);
    })
}

/* Fjerner data-containers og viser kategorierne og splashbillede mår man går tilbage på forside */
function menuForside() {
    console.log("menu forside funktion");
    document.getElementById("koed").style.display = "flex";
    document.getElementById("vegetar").style.display = "flex";
    document.getElementById("fisk").style.display = "flex";
    document.getElementById("drikkevarer").style.display = "flex";
    document.getElementById("splash").style.display = "block";
    document.getElementById("kategori-container").style.display = "grid";
    document.querySelector(".data-container").style.display = "none";


    // tekst på forside mad-kategorierne
    document.querySelector("#koed h1").textContent = "Kød";
    document.querySelector("#fisk h1").textContent = "fisk";
    document.querySelector("#vegetar h1").textContent = "vegetar";
    document.querySelector("#drikkevarer h1").textContent = "drikkevarer";
    // overskrift på splash billede //
    // ALTID BRUG textContent men fordi her
    // har vi brug for et line break <br>
    // så derfor skal paragraphen opfattes som html element//

    //tekst på splashbillede / MySlides
    document.getElementById("overskrift").innerHTML = "Højbelagt smørrebrød";
    document.getElementById("paragraphtxt").innerHTML = "Elsker du også smørrebrød? Om du er til de gode gamle klassikere, <br> eller gerne vil have et valg? - om du kun er til det grønne, eller hvis <br>du bare har lyst til lidt af det hele!";

}

// indsætter tekst i footeren, og bottom-menu i sidebaren i desktop.
function footer() {
    document.querySelector("#footerSection h1").textContent = "Følg os på";
    document.querySelector("#footerSection p").textContent = "@Copyright";
    document.querySelector("#footerSection p+p").textContent = "All Rights Reserved";
    document.querySelector("#footerSection p+p+p").tepxtContent = "@Copyright All Rights Reserved";
    document.querySelector(".bottom-menu p").textContent = "Følg os på";
};

// er i tvivl om den bruges??
function clickMenu(luk) {
    luk.classList.toggle("change");


}

//Mobil burgermmenu //


// toggler classen hidden på #menuMobil, og ændrer farven på burgermenuen til sort.

function toggleMenu() {
    console.log("toggleMenu");
    document.querySelector("#menuMobil").classList.toggle("hidden");

    document.querySelector("#body").classList.toggle("overflow");



    document.querySelector(".bar1").classList.toggle("black");
    document.querySelector(".bar2").classList.toggle("black");
    document.querySelector(".bar3").classList.toggle("black");
}

// tilføjer "hidden - display: none" til Menumobil, fjerner "change" så burgermenu'en skifter tilbage til 3 div'r, og toggler farven black.

function ResetMenuen() {
    document.querySelector("#menuMobil").classList.toggle("hidden");
    document.querySelector("#body").classList.toggle("overflow");

    document.querySelector(".burgermenu").style.position = "initial";

    document.querySelector("#burgermenu").classList.remove("change"); // resetter animationen, se CSS linje 296-308.
    document.querySelector(".bar1").classList.toggle("black");
    document.querySelector(".bar2").classList.toggle("black");
    document.querySelector(".bar3").classList.toggle("black");

}


// filtrering der snakker til data-kategorierne og kalder visRetter.
function filtrering() {
    console.log(filtrering);
    kategori = this.dataset.kategori;
    document.querySelectorAll("button").forEach(knap => {
        knap.classList.remove("valgt")
    })
    this.classList.add("valgt");
    visRetter();
}


//Functionen der kloner alle articles som hentes fra google sheetet.

function visRetter() {
    document.querySelector(".data-container").style.display = "grid";
    container.innerHTML = "";
    retter.feed.entry.forEach((ret) => {
        if (kategori == "alle" || kategori == ret.gsx$kategori.$t) {
            const klon = temp.cloneNode(true).content;
            klon.querySelector("h2").textContent = ret.gsx$navn.$t;
            klon.querySelector("img").src = `billeder/${ret.gsx$billede.$t}.png`;
            klon.querySelector("img").alt = ret.gsx$billede.$t;
            klon.querySelector(".pris").textContent = `Pris: ${ret.gsx$pris.$t}.- `;


            // skjuler forside mad-kategorierne når der trykkes ind i kategorierne. Lavet på den her måde, så alt vises på én index.html side, istedet for at have flere html'er.
            document.getElementById("koed").style.display = "none";
            document.getElementById("vegetar").style.display = "none";
            document.getElementById("fisk").style.display = "none";
            document.getElementById("drikkevarer").style.display = "none";
            document.getElementById("splash").style.display = "none";
            document.getElementById("kategori-container").style.padding = "0px";

            container.appendChild(klon);
            container.lastElementChild.addEventListener("click", () => {
                visSingle(ret)
            });
        }
    })
}

// Function der laver popup siden, og ligger eventlisterners på selve div'en og tilbage knappen.
function visSingle(ret) {
    document.querySelector("#popUp").style.display = "flex";
    document.querySelector("#popUp .luk").addEventListener("click", lukSingle);
    document.querySelector("#popUp .lukPopUp").addEventListener("click", lukSingle);
    document.querySelector("#popUp").addEventListener("click", lukSingle);

    /* document.querySelector("#indhold").style.backgroundImage = "bill";*/

    document.querySelector(".enkeltRet h2").textContent = ret.gsx$navn.$t;
    document.querySelector(".enkeltRet .billede").src = `billeder/${ret.gsx$billede.$t}.png`;
    document.querySelector(".enkeltRet .billede").alt = ret.gsx$navn.$t;
    document.querySelector(".pris").textContent = `Pris: ${ret.gsx$pris.$t}.- `;

    document.querySelector(".kort").textContent = ret.gsx$kort.$t;
    document.querySelector(".køb").textContent = `Køb`;
    document.querySelector(".anuller").textContent = `Annuller`;

    document.querySelector(".luk").style.display = " none";

    document.querySelector(".prisDesktop").textContent = `Pris: ${ret.gsx$pris.$t}.- `;
    document.querySelector(".kortDesktop").textContent = ret.gsx$kort.$t;
    document.querySelector("#body").classList.toggle("overflow");

}

// Lukker popUp vinduet.
function lukSingle() {
    document.querySelector("#popUp").style.display = "none";
    document.querySelector("#body").classList.remove("overflow");
}

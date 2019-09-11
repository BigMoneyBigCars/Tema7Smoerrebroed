var slideIndex = 0;

carousel();

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

function clickMenu(luk) {
    luk.classList.toggle("change");
}


let retter;

let kategori = "alle";

const container = document.querySelector(".data-container");

const temp = document.querySelector("template");

const article = document.querySelector(".enkeltperson");

document.addEventListener("DOMContentLoaded", getJson);

async function getJson() {

    let jsonData = await fetch("https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json");
    console.log("jsonData", jsonData);

    retter = await jsonData.json();

    console.log("retter", retter);
    visRetter();
    addEventListenerToButtons();
}


function visRetter() {
    container.innerHTML = "";
    retter.feed.entry.forEach((ret) => {
        if (kategori == "alle" || kategori == ret.gsx$kategori.$t) {
            const klon = temp.cloneNode(true).content;
            klon.querySelector("h2").textContent = ret.gsx$navn.$t;
            klon.querySelector("img").src = `imgs/large/${ret.gsx$billede.$t}.jpg`;
            klon.querySelector("img").alt = ret.gsx$billede.$t;
            klon.querySelector(".pris").textContent = `Pris: ${ret.gsx$pris.$t}.- `;
            klon.querySelector(".kort").textContent = ret.gsx$kort.$t;

            container.appendChild(klon);
            container.lastElementChild.addEventListener("click", () => {
                visSingle(ret)
            });
        }
    })
}

function addEventListenerToButtons() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtrering);
    })
}


function filtrering() {
    console.log(filtrering);
    kategori = this.dataset.kategori;
    document.querySelectorAll("button").forEach(knap => {
        knap.classList.remove("valgt")
    })
    this.classList.add("valgt");
    visRetter();
}

function visSingle(ret) {

    document.querySelector("#popUp").style.display = "block";
    document.querySelector("#popUp .luk").addEventListener("click", lukSingle);
    document.querySelector("#popUp .lukPopUp").addEventListener("click", lukSingle);

    document.querySelector(".enkeltRet h2").textContent = ret.gsx$navn.$t;
    document.querySelector(".enkeltRet .billede").src = `imgs/small/${ret.gsx$billede.$t}-sm.jpg`;
    document.querySelector(".enkeltRet .billede").alt = ret.gsx$navn.$t;
    document.querySelector(".pris").textContent = `Pris: ${ret.gsx$pris.$t}.- `;
    document.querySelector(".lang").textContent = ret.gsx$lang.$t;
}

function lukSingle() {
    document.querySelector("#popUp").style.display = "none";
}

function lukSingle() {
    document.querySelector("#popUp").style.display = "none";
} <

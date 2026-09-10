//Imports
import { Jauge, JaugeFaim } from "./Jauge.js";
import { Cron } from "./croner/dist/croner.js";
import { getRandomInt } from "./fonctions_pratiques.js";

//Création du nom du tama
var nomTamaghorrible;
if (localStorage.getItem("nomTamaghorrible") == null) {
    nomTamaghorrible = "";
}
else {
    nomTamaghorrible = String(localStorage.getItem("nomTamaghorrible"));
}
//Récupération/création du timer
var minutes;
if (localStorage.getItem("minutesTama") == null) {
    minutes = 0;
}
else {
    minutes = Number(localStorage.getItem("minutesTama"));
}
var secondes;
if (localStorage.getItem("secondesTama") == null) {
    secondes = 0;
}
else {
    secondes = Number(localStorage.getItem("secondesTama"));
}
//Création des différentes jauges
//Jauge de vie
var jaugeVie;
if (localStorage.getItem("jaugeVie") == null) {
    jaugeVie = new Jauge("Vie", 10);
}
else {
    jaugeVie = new Jauge("Vie", Number(localStorage.getItem("jaugeVie")));
}
//Jauge de Faim
var jaugeFaim;
if (localStorage.getItem("jaugeFaim") == null) {
    jaugeFaim = new JaugeFaim("Faim", 10);
}
else {
    jaugeFaim = new JaugeFaim("Faim", Number(localStorage.getItem("jaugeFaim")));
}
//Jauge de sommeil
var jaugeSommeil;
if (localStorage.getItem("jaugeSommeil") == null) {
    jaugeSommeil = new Jauge("Sommeil", 10);
}
else {
    jaugeSommeil = new Jauge("Sommeil", Number(localStorage.getItem("jaugeSommeil")));
}
//Jauge d'hygiène
var jaugeHygiene;
if (localStorage.getItem("jaugeHygiene") == null) {
    jaugeHygiene = new Jauge("Hygiène", 10);
}
else {
    jaugeHygiene = new Jauge("Hygiène", Number(localStorage.getItem("jaugeHygiene")));
}
//Jauge de santé mentale
var jaugeMental;
if (localStorage.getItem("jaugeMental") == null) {
    jaugeMental = new Jauge("Santé mentale", 10);
}
else {
    jaugeMental = new Jauge("Santé mentale", Number(localStorage.getItem("jaugeMental")));
}
//Création des différentes états spéciaux
//Booléen indiquand si la créature est malade
var boolMalade;
if (localStorage.getItem("boolMalade") == null) {
    boolMalade = false;
}
else {
    boolMalade = localStorage.getItem("boolMalade") === "true";
}
var boolTel;
//Booléen indiquant si la créature utilise le téléphone
if (localStorage.getItem("boolTel") == null) {
    boolTel = false;
}
else {
    boolTel = localStorage.getItem("boolTel") === "true";
}
//Booléen indiquant s'il fait jour
var boolJour;
if (localStorage.getItem("boolJour") == null) {
    boolJour = false;
}
else {
    boolJour = localStorage.getItem("boolJour") === "true";
}
//Booléen indiquant si la créature fait des bêtises
var boolConnerie;
if (localStorage.getItem("boolConnerie") == null) {
    boolConnerie = false;
}
else {
    boolConnerie = localStorage.getItem("boolConnerie") === "true";
}
//Booléen indiquand si la créature est en surpoid
var boolGros;
if (localStorage.getItem("boolGros") == null) {
    boolGros = false;
}
else {
    boolGros = localStorage.getItem("boolGros") === "true";
}
var boolSavon = false;
var boolMort = false;
function gamestart() {
    //Création des différents crons
    var jobFaim = new Cron('*/30 * * * * *', function () {
        jaugeFaim.addToValue(-1);
        localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
        console.log(jaugeFaim.valeur);
    });
    var jobSommeil = new Cron('*/45 * * * * *', function () {
        if (boolJour || (boolTel && !boolJour)) {
            jaugeSommeil.addToValue(-1);
        }
        localStorage.setItem("jaugeSommeil", String(jaugeSommeil.valeur));
        console.log(jaugeSommeil.valeur)
    });
    var jobDodo = new Cron('*/10 * * * * *', function () {
        if (!boolJour && !boolTel) {
            jaugeSommeil.addToValue(1);
        }
        localStorage.setItem("jaugeSommeil", String(jaugeSommeil.valeur));
    });
    var jobHygieneMental = new Cron('*/50 * * * * *', function () {
        if (boolGros) {
            jaugeHygiene.addToValue(-2);
        }
        else {
            jaugeHygiene.addToValue(-1);
        }
        if (jaugeSommeil.valeur <= 4) {
            jaugeMental.addToValue(-2);
        }
        else {
            jaugeMental.addToValue(-1);
        }
        //Mise à jour timer minutes
        localStorage.setItem("jaugeHygiene", String(jaugeHygiene.valeur));
        localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
        // On met a jour tama pour son apparence
        mettreAJourApparenceTama();
    });
    var jobHP = new Cron('*/20 * * * * *', function () {
        if (boolConnerie || boolMalade) {
            if (boolConnerie && boolMalade) {
                jaugeVie.addToValue(-2);
            }
            else {
                jaugeVie.addToValue(-1);
            }
        }
        localStorage.setItem("jaugeVie", String(jaugeVie.valeur));
        mettreAJourBarreVie();
    });
    var jobConditionsSpéciales = new Cron('*/30 * * * * *', function () {
           var roueDeLaChance = getRandomInt(1, 10);

    if (
        roueDeLaChance === 1 &&
        jaugeHygiene.valeur > 4 &&
        !boolGros &&
        !boolMalade
    ) {
        boolConnerie = true;
    }

        localStorage.setItem("boolConnerie", String(boolConnerie));
        // On met a jour tama pour son apparence
        mettreAJourApparenceTama();
    });
    var jobGros = new Cron('*/1 * * * * *', function () {
        if (jaugeFaim.valeur > 10) {
        boolGros = true;
        } else {
        boolGros = false;
        }
        //Mise à jour timer secondes
        secondes++;
        localStorage.setItem("secondesTama", String(secondes));
        localStorage.setItem("boolGros", String(boolGros));
        // Pourquoi se faire chier a faire des else if ????
        if (
            jaugeFaim.valeur <= 0 ||
            jaugeFaim.valeur >= 20 ||
            jaugeHygiene.valeur <= 0 ||
            jaugeMental.valeur <= 0 ||
            jaugeSommeil.valeur <= 0 ||
            jaugeVie.valeur <= 0
        ) {
            boolMort = true;
            changerAnimationTama("Death");
        }
    });
    var jobTel = new Cron('*/5 * * * * *', function () {
        if (boolTel) {
            jaugeMental.addToValue(1);
        }
        localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
    });

    function MiseAJourAffichage() {
    var clock = document.getElementById("clock");
    var nameDisplay = document.getElementById("tama-display-name");

    var minAffichees = String(Math.floor(secondes / 60)).padStart(2, "0");
    var secAffichees = String(secondes % 60).padStart(2, "0");

    clock.textContent = minAffichees + ":" + secAffichees;
    nameDisplay.textContent = nomTamaghorrible;
    }

    setInterval(MiseAJourAffichage, 1000);
    mettreAJourBarreVie();

}
//Fonctions d'interaction avec le tamaghorrible
//Interaction de nourriture
function donnerSalade() {
    jaugeFaim.addToValue(2);
    jaugeVie.addToValue(1);
    jaugeMental.addToValue(-1);
    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
    mettreAJourBarreVie();
}
function donnerFugu() {
    jaugeFaim.addToValue(4);
    if (getRandomInt(1, 5) == 1) {
        boolMalade = true;
    }
    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("boolMalade", String(boolMalade));
    mettreAJourBarreVie();
}
function donnerTacos() {
    jaugeFaim.addToValue(6);
    jaugeMental.addToValue(1);
    jaugeHygiene.addToValue(-2);
    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
    localStorage.setItem("jaugeHygiene", String(jaugeHygiene.valeur));
    mettreAJourBarreVie();
}
//Interactions du téléphone
function donnerTel() {
    boolTel = true;
    localStorage.setItem("boolTel", String(boolTel));
}
function prendreTel() {
    boolTel = false;
    localStorage.setItem("boolTel", String(boolTel));
}
//Autres interactions
function donnerDoliprane() {
    if (boolMalade) {
        jaugeVie.addToValue(3);
        boolMalade = false;
    }
    else {
        jaugeVie.addToValue(-3);
    }
    jaugeMental.addToValue(-3);
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
    localStorage.setItem("boolMalade", String(boolMalade));
    mettreAJourBarreVie();
}
function donnerMendale() {
    boolConnerie = false;
    jaugeVie.addToValue(-1);
    localStorage.setItem("boolConnerie", String(boolConnerie));
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur));
    mettreAJourBarreVie();
}
//Demande le nom au joueur si pas encore défini sinon lance direct le jeu
function demarrerJeu() {
    if (nomTamaghorrible === "") {
        var modal_1 = document.getElementById("name-modal");
        var form = document.getElementById("name-form");
        var input_1 = document.getElementById("tama-name");
        modal_1.showModal();
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var value = input_1.value.trim();
            if (!value)
                return;
            nomTamaghorrible = value;
            localStorage.setItem("nomTamaghorrible", nomTamaghorrible);
            modal_1.close();
            gamestart();
        });
    }
    else {
        gamestart();
    }
}

demarrerJeu();





// GESTION DE TAMA

var tama = document.getElementById("tama");
var inventory = document.getElementById("inventory");


// liste des classes css des animations de tama (si j'ai rien oublier comme un con)
var animationsTama = [
    "Idle",
    "sleepIdle",
    "SleepPhone",
    "Sick",
    "OnPhone",
    "OnPhoneDirty",
    "FatIdle",
    "FatSick",
    "FatEat",
    "FatPhone",
    "FatMouthOpen",
    "FatMad",
    "FatDirty",
    "FatDirtyMouthOpen",
    "Mandale",
    "Mad",
    "Betise",
    "DirtyIdle",
    "EatDirty",
    "MouthOpenDirty",
    "Eat",
    "MouthOpen",
    "Death"
];

// Change l'animation actuelle
function changerAnimationTama(nouvelleClasse) {

    animationsTama.forEach(function (classe) {
        tama.classList.remove(classe);
    });

    tama.classList.add(nouvelleClasse);
}

function attendrePuisActualiserApparence(duree) {
    setTimeout(function () {
        mettreAJourApparenceTama();
    }, duree);
}

function mettreAJourBarreVie() {

    var healthFill = document.getElementById("health-fill");

    if (!healthFill) {
        return;
    }

    var pourcentage = (jaugeVie.valeur / 10) * 100;

    // Empêche la barre de sortir de son cadre
    pourcentage = Math.max(0, Math.min(100, pourcentage));

    healthFill.style.width = pourcentage + "%";
}

var menuPrincipal = inventory.innerHTML;
// ouvre le menu de la bouffe
function ouvrirMenuNourriture() {

    inventory.innerHTML = `
        <li class="border-inv">
            <button type="button" data-action="food-back">
                <img
                    class="invpic"
                    src="assets/back-arrow.png"
                    width="64"
                    height="64"
                >
            </button>
        </li>

        <li class="border-inv">
            <button
                type="button"
                class="food-item"
                data-food="salade"
            >
                <img
                    class="invpic"
                    src="assets/lettuce.png"
                    width="96"
                    height="96"
                >
            </button>
        </li>

        <li class="border-inv">
            <button
                type="button"
                class="food-item"
                data-food="fugu"
            >
                <img
                    class="invpic"
                    src="assets/ramen.png"
                    width="64"
                    height="64"
                >
            </button>
        </li>

        <li class="border-inv">
            <button
                type="button"
                class="food-item"
                data-food="tacos"
            >
                <img
                    class="invpic"
                    src="assets/tacos.png"
                    width="64"
                    height="64"
                >
            </button>
        </li>
    `;
}


// retour menu classique
function fermerMenuNourriture() {
    inventory.innerHTML = menuPrincipal;
}

function mangerTama(typeNourriture) {

    // Animation bouche ouverte
    if (boolGros && jaugeHygiene.valeur <= 4) {
        changerAnimationTama("FatDirtyMouthOpen");
    } else if (boolGros) {
        changerAnimationTama("FatMouthOpen");
    } else if (jaugeHygiene.valeur <= 4) {
        changerAnimationTama("MouthOpenDirty");
    } else {
        changerAnimationTama("MouthOpen");
    }

    setTimeout(function () {

        // Animation de nourriture
        if (boolGros && jaugeHygiene.valeur <= 4) {
            changerAnimationTama("EatDirty");
        } else if (boolGros) {
            changerAnimationTama("FatEat");
        } else if (jaugeHygiene.valeur <= 4) {
            changerAnimationTama("EatDirty");
        } else {
            changerAnimationTama("Eat");
        }

        setTimeout(function () {

            // Effet de la nourriture
            if (typeNourriture === "salade") {
                donnerSalade();
            }

            if (typeNourriture === "fugu") {
                donnerFugu();
            }

            if (typeNourriture === "tacos") {
                donnerTacos();
            }

            // Retour vers le bon état
            mettreAJourApparenceTama();

        }, 600);

    }, 500);
}

function donnerMedicament() {

    if (boolGros && jaugeHygiene.valeur <= 4) {
        changerAnimationTama("FatDirtyMouthOpen");
    } else if (boolGros) {
        changerAnimationTama("FatMouthOpen");
    } else if (jaugeHygiene.valeur <= 4) {
        changerAnimationTama("MouthOpenDirty");
    } else {
        changerAnimationTama("MouthOpen");
    }

    setTimeout(function () {

        donnerDoliprane();

        mettreAJourApparenceTama();

    }, 500);
}

function laverTama() {

    jaugeHygiene.addToValue(5); // A CHANGERRRRRRRR

    localStorage.setItem(
        "jaugeHygiene",
        String(jaugeHygiene.valeur)
    );

    mettreAJourApparenceTama();
}

function frapperTama() {

    changerAnimationTama("Mandale");

    donnerMendale();

    setTimeout(function () {
        mettreAJourApparenceTama();
    }, 1300);
}

function utiliserTelephone() {

    if (!boolTel) {

        donnerTel();

        if (boolGros) {
            changerAnimationTama("FatPhone");
        } else if (jaugeHygiene.valeur <= 4) {
            changerAnimationTama("OnPhoneDirty");
        } else {
            changerAnimationTama("OnPhone");
        }

    } else {

        prendreTel();

        mettreAJourApparenceTama();
    }
}

function faireDormir() {

    // inversion des couleurs
    document.body.classList.add("sleep-mode");

    // animation de sleepy sleep
    changerAnimationTama("sleepIdle");
}

// quand on commence a bouger un item
inventory.addEventListener("dragstart", function (event) {

    var element = event.target.closest("[data-food], [data-action='medicine']");

    if (!element) {
        return;
    }

    if (element.dataset.food) {

        event.dataTransfer.setData(
            "type",
            "food"
        );

        event.dataTransfer.setData(
            "food",
            element.dataset.food
        );

    } else {

        event.dataTransfer.setData(
            "type",
            "medicine"
        );
    }
});


// autorise el drop sur tama
tama.addEventListener("dragover", function (event) {
    event.preventDefault();
});


// quand on drop un truc sur tama
tama.addEventListener("drop", function (event) {

    event.preventDefault();

    var type = event.dataTransfer.getData("type");

    if (type === "food") {

        var food = event.dataTransfer.getData("food");

        mangerTama(food);

    }

    if (type === "medicine") {

        donnerMedicament();

    }
});

// cliques dans l'iventaire

inventory.addEventListener("click", function (event) {

    var button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.food) {
        mangerTama(button.dataset.food);
        return;
    }

    var action = button.dataset.action;

    if (action === "food") {
        ouvrirMenuNourriture();
    }

    if (action === "food-back") {
        fermerMenuNourriture();
    }

    if (action === "medicine") {
        donnerMedicament();
    }

    if (action === "wash") {
        laverTama();
    }

    if (action === "hit") {
        frapperTama();
    }

    if (action === "phone") {
        utiliserTelephone();
    }


    if (action === "sleep") {
        faireDormir();
    }

});


// Apparence de tama la team (aider moi pitié)

function mettreAJourApparenceTama() {

    // Téléphone
    if (boolTel) {
        if (boolGros) {
            changerAnimationTama("FatPhone");
        } else if (jaugeHygiene.valeur <= 4) {
            changerAnimationTama("OnPhoneDirty");
        } else {
            changerAnimationTama("OnPhone");
        }
        return;
    }

    // Obèse + sale
    if (boolGros && jaugeHygiene.valeur <= 4) {
        changerAnimationTama("FatDirty");
        return;
    }

    // Sale
    if (jaugeHygiene.valeur <= 4) {
        changerAnimationTama("DirtyIdle");
        return;
    }

    // Bêtise
    if (boolConnerie) {
        changerAnimationTama("Betise");
        return;
    }

    // Malade
    if (boolMalade) {
        if (boolGros) {
            changerAnimationTama("FatSick");
        } else {
            changerAnimationTama("Sick");
        }
        return;
    }

    // Fatigué
    if (jaugeSommeil.valeur <= 4) {
        changerAnimationTama("sleepIdle");
        return;
    }

    // Folie
    if (jaugeMental.valeur <= 2) {
        if (boolGros) {
            changerAnimationTama("FatMad");
        } else {
            changerAnimationTama("Mad");
        }
        return;
    }

    // Obèse
    if (boolGros) {
        changerAnimationTama("FatIdle");
        return;
    }

    // Normal
    changerAnimationTama("Idle");
}










window.debugTama = {
    vie: jaugeVie,
    faim: jaugeFaim,
    sommeil: jaugeSommeil,
    hygiene: jaugeHygiene,
    mental: jaugeMental
};
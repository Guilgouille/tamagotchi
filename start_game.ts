//Imports
import { Jauge, JaugeHP } from "./Jauge.ts";
import { Cron } from "croner";
import { getRandomInt } from "./fonctions_pratiques.ts";

//Création du nom du tama
let nomTamaghorrible : string;
if(localStorage.getItem("nomTamaghorrible") == null) {
    nomTamaghorrible = ""
} else {
    nomTamaghorrible = String(localStorage.getItem("nomTamaghorrible"));
}
//Récupération/création du timer
let minutes : number;
if(localStorage.getItem("minutesTama") == null){
    minutes = 0
} else {
    minutes = Number(localStorage.getItem("minutesTama"))
}

let secondes : number;
if(localStorage.getItem("secondesTama") == null){
    secondes = 0
} else {
    secondes = Number(localStorage.getItem("secondesTama"))
}

//Création des différentes jauges
//Jauge de vie
let jaugeVie : JaugeHP;
if(localStorage.getItem("jaugeVie") == null) {
    jaugeVie = new Jauge("Vie", 10);
} else {
    jaugeVie = new Jauge("Vie", Number(localStorage.getItem("jaugeVie")));
}
//Jauge de Faim
let jaugeFaim : Jauge;
if(localStorage.getItem("jaugeFaim") == null) {
    jaugeFaim = new Jauge("Faim", 10);
} else {
    jaugeFaim = new Jauge("Faim", Number(localStorage.getItem("jaugeFaim")));
}
//Jauge de sommeil
let jaugeSommeil : Jauge;
if(localStorage.getItem("jaugeSommeil") == null) {
    jaugeSommeil = new Jauge("Sommeil", 10);
} else {
    jaugeSommeil = new Jauge("Sommeil", Number(localStorage.getItem("jaugeSommeil")));
}

//Jauge d'hygiène
let jaugeHygiene : Jauge
if(localStorage.getItem("jaugeHygiene") == null) {
    jaugeHygiene = new Jauge("Hygiène", 10);
} else {
    jaugeHygiene = new Jauge("Hygiène", Number(localStorage.getItem("jaugeHygiene")));
}

//Jauge de santé mentale
let jaugeMental : Jauge;
if(localStorage.getItem("jaugeMental") == null) {
    jaugeMental = new Jauge("Santé mentale", 10);
} else {
    jaugeMental = new Jauge("Santé mentale", Number(localStorage.getItem("jaugeMental")));
}

//Création des différentes états spéciaux
//Booléen indiquand si la créature est malade
let boolMalade : boolean;
if(localStorage.getItem("boolMalade") == null) {
    boolMalade = false;
} else {
    boolMalade = localStorage.getItem("boolMalade") === "true";
}
let boolTel : boolean;
//Booléen indiquant si la créature utilise le téléphone
if(localStorage.getItem("boolTel") == null) {
    boolTel = false;
} else {
    boolTel = localStorage.getItem("boolTel") === "true";
}
//Booléen indiquant s'il fait jour
let boolJour : boolean;
if(localStorage.getItem("boolJour") == null) {
    boolJour = false;
} else {
    boolJour = localStorage.getItem("boolJour") === "true";
}
//Booléen indiquant si la créature fait des bêtises
let boolConnerie : boolean;
if(localStorage.getItem("boolConnerie") == null) {
    boolConnerie = false;
} else {
    boolConnerie = localStorage.getItem("boolConnerie") === "true";
}
//Booléen indiquand si la créature est en surpoid
let boolGros : boolean;
if(localStorage.getItem("boolGros") == null){
    boolGros = false;
} else {
    boolGros = localStorage.getItem("boolGros") === "true";
}

let boolSavon : boolean = false;
let boolMort : boolean = false


//Création des différents crons
const jobFaim = new Cron('*/30 * * * * *', () => {
	jaugeFaim.addToValue(-1);
    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
});

const jobSommeil = new Cron('*/40 * * * * *', () => {
    if(boolJour || (boolTel && !boolJour)){
        jaugeSommeil.addToValue(-1);
    }
    localStorage.setItem("jaugeSommeil", String(jaugeSommeil.valeur))
})

const jobDodo = new Cron('*/10 * * * * *', () => {
    if(!boolJour && !boolTel){
        jaugeSommeil.addToValue(1);
    }
    localStorage.setItem("jaugeSommeil", String(jaugeSommeil.valeur))
})

const jobHygieneMental = new Cron('*/60 * * * * *', () => {
    if(boolGros) {
        jaugeHygiene.addToValue(-2);
    } else {
        jaugeHygiene.addToValue(-1);
    }

    if(jaugeSommeil.valeur <= 4) {
        jaugeMental.addToValue(-2)
    } else {
        jaugeMental.addToValue(-1)
    }

    //Mise à jour timer minutes
    minutes ++
    localStorage.setItem("minutesTama", String(minutes))

    localStorage.setItem("jaugeHygiene", String(jaugeHygiene.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
})

const jobHP = new Cron('*/20 * * * * *', () => {
    if(boolConnerie || boolMalade){
        if(boolConnerie && boolMalade){
            jaugeVie.addToValue(-2);
        } else {
            jaugeVie.addToValue(-1);
        }
    }
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur))
})

const jobConditionsSpéciales = new Cron('*/20 * * * * *', () => {
    let roueDeLaChance : number = getRandomInt(1, 10);
    if(jaugeHygiene.valeur <= 4) {
        if(roueDeLaChance <= 5) {
            boolMalade = true;
        } 
    } else if(boolGros) {
        if(roueDeLaChance == 1) {
            boolMalade == true;
        }
    } else {
        if(roueDeLaChance == 1) {
            if(getRandomInt(0, 1) == 0) {
                boolMalade = true
            } else {
                boolConnerie = true
            }
        }
    }
    localStorage.setItem("boolMalade", String(boolMalade));
    localStorage.setItem("boolGros", String(boolGros));
})

const jobGros = new Cron('*/1 * * * * *', () => {
    if(jaugeFaim.valeur <= 10 && boolGros) {
        boolGros = false;
    }

    //Mise à jour timer secondes
    secondes ++
    localStorage.setItem("secondesTama", String(secondes))

    localStorage.setItem("boolGros", String(boolGros));

    if(jaugeFaim.valeur == 0){
        boolMort = true
    } else if(jaugeHygiene.valeur == 0) {
        boolMort = true
    } else if(jaugeMental.valeur == 0) {
        boolMort = true
    } else if(jaugeSommeil.valeur == 0) {
        boolMort = true
    } else if(jaugeVie.valeur == 0) {
        boolMort = true
    }
})

const jobTel = new Cron('*/5 * * * * *', () => {
    if(boolTel){
        jaugeMental.addToValue(1)
    }
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
})


//Fonctions d'interaction avec le tamaghorrible
//Interaction de nourriture
function donnerSalade(){
    jaugeFaim.addToValue(2);
    jaugeVie.addToValue(1);
    jaugeMental.addToValue(-1);

    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
}

function donnerFugu(){
    jaugeFaim.addToValue(4);
    if(getRandomInt(1, 5) == 1){
        boolMalade = true;
    }

    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("boolMalade", String(boolMalade));
}

function donnerTacos(){
    jaugeFaim.addToValue(6);
    jaugeMental.addToValue(1);
    jaugeHygiene.addToValue(-2);

    localStorage.setItem("jaugeFaim", String(jaugeFaim.valeur));
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur));
    localStorage.setItem("jaugeHygiene", String(jaugeHygiene.valeur));
}

//Interactions du téléphone
function donnerTel(){
    boolTel = true
    localStorage.setItem("boolTel", String(boolTel));
}

function prendreTel(){
    boolTel = false;
    localStorage.setItem("boolTel", String(boolTel));
}

//Autres interactions
function donnerDoliprane() {
    if(boolMalade) {
        jaugeVie.addToValue(3)
        boolMalade = false
    } else {
        jaugeVie.addToValue(-3)
    }
    jaugeMental.addToValue(-3)

    localStorage.setItem("jaugeVie", String(jaugeVie.valeur))
    localStorage.setItem("jaugeMental", String(jaugeMental.valeur))
    localStorage.setItem("boolMalade", String(boolMalade))
}

function donnerMendale() {
    boolConnerie = false
    jaugeVie.addToValue(-1)

    localStorage.setItem("boolConnerie", String(boolConnerie))
    localStorage.setItem("jaugeVie", String(jaugeVie.valeur))
}
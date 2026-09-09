//Imports
import { Jauge } from "./Jauge.ts";
import { Cron } from "croner";
import { getRandomInt } from "./fonctions_pratiques.ts";

//Création des différentes jauges
//Jauge de vie
let jaugeVie : Jauge;
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


//Création des différents crons
const jobFaim = new Cron('*/30 * * * * *', () => {
	jaugeFaim.addToValue(-1);
});

const jobSommeil = new Cron('*/40 * * * * *', () => {
    if(boolJour || (boolTel && !boolJour)){
        jaugeSommeil.addToValue(-1);
    }
})

const jobDodo = new Cron('*/10 * * * * *', () => {
    if(!boolJour && !boolTel){
        jaugeSommeil.addToValue(1);
    }
})

const jobHygiene = new Cron('*/60 * * * * *', () => {
    if(boolGros) {
        jaugeHygiene.addToValue(-2);
    } else {
        jaugeHygiene.addToValue(-1);
    }
})

const jobHP = new Cron('*/20 * * * * *', () => {
    if(boolConnerie || boolMalade){
        if(boolConnerie && boolMalade){
            jaugeVie.addToValue(-2);
        } else {
            jaugeVie.addToValue(-1);
        }
    }
})

const jobConditionsSpéciales = new Cron('*/20 * * * * *', () => {
    let roueDeLaChance : number = getRandomInt(1, 10);
    if(jaugeHygiene.valeur <= 4) {
        if(roueDeLaChance <= 2) {
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
})

const jobGros = new Cron('*/1 * * * * *', () => {
    if(jaugeFaim.valeur <= 10 && boolGros) {
        boolGros = false;
    }
})
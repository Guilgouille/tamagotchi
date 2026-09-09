

//Définition du type d'objet "Jauge"
export class Jauge {
    nom : string;
    valeur : number;

    constructor(nom : string, valeur : number){
        this.nom = nom;
        this.valeur = valeur;
    }

    addToValue(num : number) {
        if(this.valeur + num <= 10){
            this.valeur += num;
        } else {
            this.valeur = 10;
        }
    }
}

//Cas particulier de la jauge de vie
export class JaugeHP {
    nom : string;
    valeur : number;

    constructor(nom : string, valeur : number){
        this.nom = nom;
        this.valeur = valeur;
    }

    addToValue(num : number) {
        this.valeur += num;
    }
}
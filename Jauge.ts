//Définition du type d'objet "Jauge"
export class Jauge {
    nom : string;
    valeur : number;

    constructor(nom : string, valeur : number){
        this.nom = nom;
        this.valeur = valeur;
    }

    //Methode d'update de la valeur de la jauge
    setValeur(newValeur : number){
        this.valeur = newValeur;
    }

    //une methode pour soustraire la jauge de 1 (pour les cron)
    addToValue(num : number) {
        this.valeur += num;
    }
}

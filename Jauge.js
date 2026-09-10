//Définition du type d'objet "Jauge"
var Jauge = /** @class */ (function () {
    function Jauge(nom, valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }
    Jauge.prototype.addToValue = function (num) {
        if (this.valeur + num <= 10) {
            this.valeur += num;
        }
        else {
            this.valeur = 10;
        }
    };
    return Jauge;
}());

// Cas particulier de la jauge de faim

var JaugeFaim = /** @class */ (function () {

    function JaugeFaim(nom, valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }

    JaugeFaim.prototype.addToValue = function (num) {

        this.valeur += num;

        if (this.valeur < 0) {
            this.valeur = 0;
        }

        if (this.valeur > 20) {
            this.valeur = 20;
        }
    };

    return JaugeFaim;

}());

export { JaugeFaim, Jauge };
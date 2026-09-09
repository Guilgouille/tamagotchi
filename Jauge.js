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
export { Jauge };
//Cas particulier de la jauge de vie
var JaugeHP = /** @class */ (function () {
    function JaugeHP(nom, valeur) {
        this.nom = nom;
        this.valeur = valeur;
    }
    JaugeHP.prototype.addToValue = function (num) {
        this.valeur += num;
    };
    return JaugeHP;
}());
export { JaugeHP };
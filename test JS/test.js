function prout(id) {
    this.id = id;
    this.effect = function () {
        console.log('methode');
    };
}
var test = new prout(4);

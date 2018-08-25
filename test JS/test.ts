function prout(id: number) : void{
    this.id = id
    this.effect = function() {
        console.log('methode');
    }
}

let test = new prout(4);
console.log(typeof test);
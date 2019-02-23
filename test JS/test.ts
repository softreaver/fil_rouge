export class Card {
    private name: string;
    private life: number;
    private maxLife: number;

    constructor(name: string, maxLife: number) {
        this.name = name;
        this.maxLife = maxLife;
        this.life = maxLife;
    }

    decreaseLife (amount: number) {
        this.life -= amount;
        if (this.life < 0) {
            this.life = 0;
        }
    }

    getLife () {
        return this.life;
    }
}

export class MagicCard extends Card {
    constructor(name: string, maxLife: number) {
        super(name, maxLife);
    }
}

export enum ENUM {
    ONE = 1,
    TWO
}

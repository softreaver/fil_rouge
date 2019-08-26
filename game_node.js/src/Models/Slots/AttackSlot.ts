import { Slot } from "./Slot";
import { Player } from "../Player";

export class AttackSlot extends Slot {
    public constructor (ID: number, player: Player) {
        super(ID, player);
    }
}

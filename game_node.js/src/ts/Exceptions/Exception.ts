
export class Exception {
    public message: string;
    public messageIHM: string;

    public constructor (message: string, messageIHM: string = 'Erreur inconnue') {
        this.message = new Error(message).stack;
        this.messageIHM = messageIHM;
    }
}

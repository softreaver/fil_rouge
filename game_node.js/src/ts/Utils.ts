"use strict";

let fileSystem = require('fs');
import { CardCollection } from "./Models/Cards/CardCollection/CardCollection";

export abstract class Utils {
    public static getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	public static loadCardCollection (): CardCollection {
		return null;
	}

	public static ls (folderPath: string): string[] {
		return null;
	}

	public static readFile (file: string): ArrayBuffer {
		return null;
	}

	public static writeFile (file: string, data: ArrayBuffer, cbSuccess: Function, cbError: Function): void {
		let dataBuffer:Buffer = Buffer.from(data);
		fileSystem.writeFile(file, dataBuffer, function (err) {
			if (err) {
				cbError();
			} else {
				cbSuccess();
			}
		});
	}

	public static encodeImageUrl (url: string, cbSuccess: Function, cbError: Function): void {
		try {
            let oReq = new XMLHttpRequest();
        
            oReq.open("GET", url, true);
            oReq.responseType = "arraybuffer";
            oReq.onload = function(event) {
                if (oReq.readyState === 4) {  
                    if (oReq.status === 200) {
                        let arrayBuffer = oReq.response;
                        if (arrayBuffer) {
                            let byteArray = new Uint8Array(arrayBuffer);
                            let blob = new Blob( [ byteArray ], { type: "image/jpeg" } );
                            let urlCreator = window.URL || window.webkitURL;
                            let imageUrl = urlCreator.createObjectURL( blob );

							cbSuccess(imageUrl);
                        }
                    } else {  
                        cbError("Error http response code " + oReq.status);  
                    }  
                }  
            }

            oReq.send();
        } catch (err) {
            App.log(new Error('[ERREUR] ' + (err.message || err)).stack)
            cbError('Erreur lors de la récupération de la photo n°');
        }
	}
}

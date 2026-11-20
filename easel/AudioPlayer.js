export default class AudioPlayer {
	
    constructor(filePaths, prefix = "", suffix = "") {
		this.sounds = new Map();
		for (let path of filePaths) {
			const audio = new Audio(prefix + path + suffix); // i.e. "./sounds/" + "mySound" + ".mp3"
			this.sounds.set(path, audio);
		}
	}
	
	play(filePath) {
		const sound = this.sounds.get(filePath);
		sound.play();
		return sound;
	}

	playNew(filePath) {
		const sound = this.sounds.get(filePath);
		const newSoundInstance = sound.cloneNode(); // unoptomized
		newSoundInstance.play();
		return newSoundInstance; // allow you to .pause() and .play() at will
	}

}

// todo: create demo program & add to README.md
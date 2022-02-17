import { Player } from "@react-native-community/audio-toolkit";

interface PreviewState {
    playingBeatmapsetID: number,
    isPlaying: boolean
}

class PreviewService {

    private playingBeatmapsetID: number = -1;
    private isPlaying: boolean = false;

    private observers: Function[] = [];
    private previewURL = "https://b.ppy.sh/preview/";

    private player: Player | null = null;

    public play = async (beatmapsetID: number) => {
        this.unload();

        this.playingBeatmapsetID = beatmapsetID;
        this.isPlaying = true;
        this.notifyObservers();
    
        this.player = new Player(this.previewURL + beatmapsetID + ".mp3", {
            autoDestroy: false,
            continuesToPlayInBackground: true,
        });
    
        this.player.on("ended", () => {
            this.unload();
        })
    
    
        this.player.play((err) => {
            console.log(err)
        });
    }

    public unload = async () => {
        this.playingBeatmapsetID = -1;
        this.isPlaying = false;
        this.notifyObservers();
    
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
    }

    public playPause = async () => {
        if (this.player) {
            this.player.playPause(() => {
                this.isPlaying = this.player.isPlaying;
                this.notifyObservers();
            });
        }
    }

    public registerObserver = (observer: Function) => {
        this.observers.push(observer);
    }

    public unregisterObserver = (observer: Function) => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers = () => {
        for (let i = 0; i < this.observers.length; i++) {
            this.observers[i]({...this.getObject()});
        }
    }

    public getObject = (): PreviewState => {
        return {
            playingBeatmapsetID: this.playingBeatmapsetID,
            isPlaying: this.isPlaying
        };
    }
}

export default new PreviewService();
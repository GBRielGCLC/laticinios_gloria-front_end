let progressCallback: ((percent: number) => void) | null = null;

export const setProgressCallback = (cb: ((percent: number) => void) | null) => {
    progressCallback = cb;
};

export const reportProgress = (percent: number) => {
    if (progressCallback) {
        progressCallback(percent);
        // console.log(`O progresso atual é ${percent}%, direto no callback`)
    }
};

async function gzipAndBase64EncodeBlob(blob: Blob): Promise<string> {
    const gzipStream = blob.stream().pipeThrough(new CompressionStream('gzip'));
    const gzippedBytes: Uint8Array = await readStream(gzipStream);

    const binString: string = Array.from(gzippedBytes, (byte: number) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
}

async function base64DecodeAndGunzipString(base64String: string, mimeType: string): Promise<Blob> {
    // base64 to byte array
    const binString: string = atob(base64String);
    const byteArray: Uint8Array = Uint8Array.from(binString, (m) => m.codePointAt(0));

    const gzippedContentStream: ReadableStream = new Blob([byteArray]).stream();
    const gunzippedStream = gzippedContentStream.pipeThrough(new DecompressionStream('gzip'));
    const gunzippedContentStream: Uint8Array = await readStream(gunzippedStream);

    return new Blob([gunzippedContentStream], {type: mimeType});
}

async function readStream(stream: ReadableStream): Promise<Uint8Array> {
    const chunks = [] as Uint8Array[];
    const reader: ReadableStreamDefaultReader = stream.getReader();

    let res: ReadableStreamReadResult<Uint8Array> = await reader.read();
    while (!res.done) {
        chunks.push(res.value);
        res = await reader.read();
    }

    return combineByteArrays(chunks);
}

function combineByteArrays(byteArrays: Uint8Array[]): Uint8Array {
    const length: number = byteArrays.reduce((acc, curr) => acc + curr.length, 0);
    const combinedByteArray = new Uint8Array(length);
    let offset = 0;
    for (const byteArray of byteArrays) {
        combinedByteArray.set(byteArray, offset);
        offset += byteArray.length;
    }
    return combinedByteArray;
}

export const transmissionUtil = {
    gzipAndBase64EncodeBlob,
    base64DecodeAndGunzipString
};

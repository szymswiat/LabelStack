declare module 'dicomweb-client' {
  namespace api {
    type ProgressCallback = (event: ProgressEvent) => void;

    class DICOMwebClient {
      headers: Record<string, string>;
      wadoURL: string;

      constructor(options: any);

      static _getCommonMediaType(mediaTypes: string[]): string;

      retrieveInstance(options: object): ArrayBuffer;

      _httpGetMultipartApplicationDicom(
        url: string,
        mediaTypes: string[],
        params: object,
        progressCallback: ProgressCallback
      ): Promise<ArrayBuffer[]>;

      _httpGetMultipartApplicationOctetStream(
        url: string,
        mediaTypes: string[],
        byteRange: number[],
        params: object,
        progressCallback: ProgressCallback
      ): Promise<ArrayBuffer[]>;

      _httpGetMultipartImage(
        url: string,
        mediaTypes: string[],
        byteRange: number[],
        params: object,
        rendered: boolean,
        progressCallback: ProgressCallback
      ): Promise<ArrayBuffer[]>;

      _httpGetMultipartVideo(
        url: string,
        mediaTypes: string[],
        byteRange: number[],
        params: object,
        rendered: boolean,
        progressCallback: ProgressCallback
      ): Promise<ArrayBuffer[]>;
    }
  }

  export { api };
}

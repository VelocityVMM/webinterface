export class MediaList {
    public media?: Media[];
}

export class Media {
    public mid?: number;
    public mpid?: number;
    public name?: string;
    public type?: string;
    public size?: number;
    public readonly?: boolean;
}

export class Pool {
    public mpid?: number
    public name?: string
    public write?: boolean
    public manage?: boolean
}
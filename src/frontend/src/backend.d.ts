import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Ratings {
    happiness: bigint;
    good: bigint;
    love: bigint;
    luck: bigint;
    overall: bigint;
}
export type ZodiacSign = bigint;
export interface backendInterface {
    getAllQuotations(): Promise<Array<[ZodiacSign, string | null]>>;
    getAllRatings(): Promise<Array<[ZodiacSign, Ratings | null]>>;
    getQuotation(zodiacSign: ZodiacSign): Promise<string | null>;
    getRatings(zodiacSign: ZodiacSign): Promise<Ratings | null>;
    setQuotation(zodiacSign: ZodiacSign, quotation: string): Promise<void>;
    setRatings(zodiacSign: ZodiacSign, luck: bigint, happiness: bigint, love: bigint, good: bigint, overall: bigint): Promise<void>;
}

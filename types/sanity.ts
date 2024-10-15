import { SanityReference } from '@sanity/image-url/lib/types/types';

export interface SanityImageHotspot {
    _type: 'sanity.imageHotspot';
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface SanityImageCrop {
    _type: 'sanity.imageCrop';
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface Evenement {
    _id: string;
    _type: 'evenement';
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title?: string;
    description?: string;
    eventDates?: string[];
    timeSlots?: string[];
    mainImage?: {
        asset?: SanityReference;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: 'image';
    };
    personality?: {
        firstName?: string;
        lastName?: string;
        title?: string;
        photoUrl?: string;
    };
    slug?: {
        _type: 'slug';
        current?: string;
    };
}

export type EVENTS_QUERYResult = Evenement[];

declare const internalGroqTypeReferenceTo: unique symbol;

export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnailUrl?: string | null;
}

export interface ProductDetail {
    id: number;
    title: string;
    description?: string | null;
    price: number;
    category: string;
    thumbnailUrl?: string | null;
}
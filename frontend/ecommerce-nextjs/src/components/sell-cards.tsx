"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

export function SellCards() {
    interface Product {
        id: number;
        name: string;
        price: number | string;
        description: string;
        code: string;
        image: string;
        stock: number;
    }

    const [list, setList] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cartIds, setCartIds] = useState<number[]>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:3000/product/all");
                if (!res.ok) throw new Error(`API error ${res.status}`);
                const data = await res.json();
                setList(data ?? []);
            } catch (err: any) {
                console.error(err);
                setError("Não foi possível carregar os produtos.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const router = useRouter();

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const res = await fetch('http://localhost:3000/wishlist/all', { headers });
                if (!res.ok) return;
                const data = await res.json();
                const ids = (data ?? []).map((w: any) => w.product?.id).filter(Boolean) as number[];
                setWishlistIds(ids);
            } catch (err) {
                console.error('Could not load wishlist', err);
            }
        };
        loadWishlist();
    }, []);

    const formatPrice = (value: number | string) => {
        const n = typeof value === 'string' ? parseFloat(value) : value;
        if (Number.isNaN(n)) return "R$ 0,00";
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
    }

    return (
        <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
            {loading && <div className="text-center py-8">Carregando produtos...</div>}
            {error && <div className="text-red-600 text-center py-4">{error}</div>}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {list.map((p) => (
                    <Card key={p.id} className="overflow-hidden rounded-lg shadow-sm">
                        <div className="flex items-center justify-end gap-2 p-3">
                            <Button
                                variant={wishlistIds.includes(p.id) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={async () => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        router.push('/login');
                                        return;
                                    }
                                    const currently = wishlistIds.includes(p.id);
                                    setWishlistIds((prev) => currently ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                                    try {
                                        const res = await fetch("http://localhost:3000/wishlist/create", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                            body: JSON.stringify({ productId: p.id }),
                                        });
                                        if (!res.ok) throw new Error(`Wishlist API error ${res.status}`);
                                    } catch (err) {
                                        console.error(err);
                                        setWishlistIds((prev) => currently ? [...prev, p.id] : prev.filter(id => id !== p.id));
                                    }
                                }}
                                className="p-2"
                            >
                                <Heart className={`${wishlistIds.includes(p.id) ? 'text-red-500' : ''} w-4 h-4`} />
                            </Button>

                            <Button
                                variant={cartIds.includes(p.id) ? "secondary" : "ghost"}
                                size="sm"
                                onClick={async () => {
                                    const currently = cartIds.includes(p.id);
                                    setCartIds((prev) => currently ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                                    try {
                                        const res = await fetch("http://localhost:3000/cart/create", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ productId: p.id, quantity: 1 }),
                                        });
                                        if (!res.ok) throw new Error(`Cart API error ${res.status}`);
                                    } catch (err) {
                                        console.error(err);
                                        setCartIds((prev) => currently ? [...prev, p.id] : prev.filter(id => id !== p.id));
                                    }
                                }}
                                className="p-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="relative">
                            <img src={p.image} alt={p.name} className="w-full h-56 object-cover" />
                        </div>

                        <CardContent>
                            <h3 className="text-sm line-clamp-2 mb-2">{p.name}</h3>
                            <div className="font-bold text-lg">{formatPrice(p.price)}</div>
                            <div className="text-xs text-gray-500 mt-1">2x de {formatPrice((typeof p.price === 'string' ? parseFloat(p.price) : p.price) / 2)}*</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
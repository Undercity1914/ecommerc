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
                    <Card key={p.id} className="overflow-hidden">
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
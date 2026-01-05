import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import React, { useEffect, useState } from "react";

type WishlistProps = {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function Wishlist({ children, open, onOpenChange }: WishlistProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('http://localhost:3000/wishlist/all');
                if (!res.ok) throw new Error(`API ${res.status}`);
                const data = await res.json();
                const prods = (data ?? []).map((w: any) => w.product).filter(Boolean);
                setProducts(prods);
            } catch (err: any) {
                console.error('Could not load wishlist', err);
                setError('Não foi possível carregar a lista de desejos.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open]);

    const formatPrice = (value: number | string) => {
        const n = typeof value === 'string' ? parseFloat(value) : value;
        if (Number.isNaN(n)) return "R$ 0,00";
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
    }
    return (
        <div>
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                {children ? (
                    <AlertDialogTrigger asChild>
                        {children}
                    </AlertDialogTrigger>
                ) : (
                    open === undefined ? (
                        <AlertDialogTrigger asChild>
                            <Button><Heart />Lista de Desejos</Button>
                        </AlertDialogTrigger>
                    ) : null
                )}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Minha Lista de Desejos</AlertDialogTitle>
                        <AlertDialogDescription>
                            Produtos que você salvou.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="p-4">
                        {loading && <div>Carregando...</div>}
                        {error && <div className="text-red-600">{error}</div>}
                        {!loading && !error && products.length === 0 && (
                            <div>Nenhum produto na sua lista de desejos.</div>
                        )}

                        <ul className="space-y-3">
                            {products.map((p) => (
                                <li key={p.id} className="flex items-center gap-3">
                                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-sm text-muted-foreground">{formatPrice(p.price)}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                        <AlertDialogAction>Ok</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
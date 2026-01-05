import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react";

type CartProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function Cart({ open, onOpenChange }: CartProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const res = await fetch('http://localhost:3000/cart/all', { headers });
                if (!res.ok) throw new Error(`API ${res.status}`);
                const data = await res.json();
                const prods = (data ?? []).flatMap((c: any) => (c.products ?? []));
                setItems(prods);
            } catch (err: any) {
                console.error('Could not load cart', err);
                setError('Não foi possível carregar o carrinho.');
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Seu Carrinho</AlertDialogTitle>
                        <AlertDialogDescription>Itens adicionados ao seu carrinho.</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {loading && <div>Carregando...</div>}
                        {error && <div className="text-red-600">{error}</div>}
                        {!loading && !error && items.length === 0 && (
                            <div>Seu carrinho está vazio.</div>
                        )}

                        <ul className="space-y-3">
                            {items.map((p) => (
                                <li key={p.id} className="flex items-center gap-3 py-2">
                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{p.name}</div>
                                        <div className="text-sm text-muted-foreground">{formatPrice(p.price)}</div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async () => {
                                                const prod = p;
                                                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                                const headers: any = { 'Content-Type': 'application/json' };
                                                if (token) headers['Authorization'] = `Bearer ${token}`;
                                                // optimistic remove
                                                setItems((prev) => prev.filter((x) => x.id !== prod.id));
                                                try {
                                                    const res = await fetch('http://localhost:3000/cart/remove', {
                                                        method: 'POST',
                                                        headers,
                                                        body: JSON.stringify({ productId: prod.id }),
                                                    });
                                                    if (!res.ok) throw new Error(`Cart remove error ${res.status}`);
                                                } catch (err) {
                                                    console.error('Could not remove cart item', err);
                                                    setItems((prev) => [prod, ...prev]);
                                                    setError('Não foi possível remover o item do carrinho.');
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                        <AlertDialogAction>Ir para Pagamento</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
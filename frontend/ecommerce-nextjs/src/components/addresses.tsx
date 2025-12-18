"use client"

import React, { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export interface Address {
    id: string
    street: string
    city?: string
    state?: string
    zip?: string
    country?: string
}

export default function Addresses({ initial = [] }: { initial?: Address[] }) {
    const STATES = [
        { uf: 'AC', name: 'Acre' },
        { uf: 'AL', name: 'Alagoas' },
        { uf: 'AP', name: 'Amapá' },
        { uf: 'AM', name: 'Amazonas' },
        { uf: 'BA', name: 'Bahia' },
        { uf: 'CE', name: 'Ceará' },
        { uf: 'DF', name: 'Distrito Federal' },
        { uf: 'ES', name: 'Espírito Santo' },
        { uf: 'GO', name: 'Goiás' },
        { uf: 'MA', name: 'Maranhão' },
        { uf: 'MT', name: 'Mato Grosso' },
        { uf: 'MS', name: 'Mato Grosso do Sul' },
        { uf: 'MG', name: 'Minas Gerais' },
        { uf: 'PA', name: 'Pará' },
        { uf: 'PB', name: 'Paraíba' },
        { uf: 'PR', name: 'Paraná' },
        { uf: 'PE', name: 'Pernambuco' },
        { uf: 'PI', name: 'Piauí' },
        { uf: 'RJ', name: 'Rio de Janeiro' },
        { uf: 'RN', name: 'Rio Grande do Norte' },
        { uf: 'RS', name: 'Rio Grande do Sul' },
        { uf: 'RO', name: 'Rondônia' },
        { uf: 'RR', name: 'Roraima' },
        { uf: 'SC', name: 'Santa Catarina' },
        { uf: 'SP', name: 'São Paulo' },
        { uf: 'SE', name: 'Sergipe' },
        { uf: 'TO', name: 'Tocantins' },
    ]

    const [addresses, setAddresses] = useState<Address[]>(initial)
    const [form, setForm] = useState({ street: "", city: "", state: "", zip: "", country: "BR" })
    const [cepLoading, setCepLoading] = useState(false)
    const [cepError, setCepError] = useState<string | null>(null)

    const router = useRouter();

    const [alert, setAlert] = useState<{ variant?: "default" | "destructive"; title?: string; description?: string } | null>(null)
    useEffect(() => {
        let t: number | undefined
        if (alert) t = window.setTimeout(() => setAlert(null), 5000)
        return () => { if (t) clearTimeout(t) }
    }, [alert])

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | string | null>(null)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetch("http://localhost:3000/address/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => res.json()).then(data => {
                setAddresses(data)
            })
        }
        else
            router.push('/login');
    }, [])

    async function lookupCep(cleanCep: string) {
        setCepError(null)
        setCepLoading(true)
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            if (!res.ok) throw new Error('Failed to lookup CEP')
            const json = await res.json()
            if (json.erro) {
                setCepError('CEP não encontrado.')
            } else {
                setForm((f) => ({ ...f, city: json.localidade || '', state: json.uf || '' }))
            }
        } catch (e) {
            setCepError('Erro ao buscar CEP.')
            console.error(e)
        } finally {
            setCepLoading(false)
        }
    }

    function handleZipChange(value: string) {
        const only = (value ?? '').replace(/\D/g, '')
        setForm((f) => ({ ...f, zip: only }))
        setCepError(null)
        if (only.length === 8) lookupCep(only)
    }

    function isFormValid() {
        const { street, city, state, zip } = form
        const zipDigits = (zip ?? '').replace(/\D/g, '')
        return Boolean(street?.trim() && city?.trim() && state?.trim() && zipDigits.length === 8)
    }

    async function HandleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isFormValid()) {
            setAlert({ variant: 'destructive', title: 'Erro', description: 'Preencha todos os campos obrigatórios: rua, cidade, estado e CEP (8 dígitos).' })
            return
        }

        try {
            const payload = { ...form, zip: form.zip.replace(/\D/g, '') }
            const token = localStorage.getItem('token')
            const response = await fetch("http://localhost:3000/address/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Failed to create address");
            }

            setAddresses((s) => [data as Address, ...s]);
            setForm({ street: "", city: "", state: "", zip: "", country: "BR" });
            setAlert({ variant: 'default', title: 'Sucesso', description: 'Endereço adicionado' })
        } catch (error) {
            console.error("Error creating address:", error);
            setAlert({ variant: 'destructive', title: 'Erro', description: 'Falha ao adicionar endereço' })
        }
    }

    function handleChange<K extends keyof typeof form>(key: K, value: string) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    function addAddress() {
        if (!form.street.trim()) return
        const newAddress: Address = { id: String(Date.now()), ...form }
        setAddresses((s) => [newAddress, ...s])
        setForm({ street: "", city: "", state: "", zip: "", country: "" })
    }

    async function performDelete(id: number | string) {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3000/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.message || 'Erro ao remover endereço')
            }
            setAddresses((s) => s.filter((a) => String(a.id) !== String(id)))
            setAlert({ variant: 'default', title: 'Sucesso', description: 'Endereço removido' })
            setConfirmDeleteId(null)
        } catch (e) {
            console.error('Failed to delete address', e)
            setAlert({ variant: 'destructive', title: 'Falha', description: 'Falha ao remover endereço' })
            setConfirmDeleteId(null)
        }
    }

    function removeAddress(id: number | string) {
        setConfirmDeleteId(id)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Endereços</CardTitle>
                <CardDescription>Gerencie seus endereços de entrega</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2 mb-4">
                    {alert && (
                        <Alert variant={alert.variant} className="mb-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    {alert.description && <AlertDescription>{alert.description}</AlertDescription>}
                                </div>
                                <div>
                                    <Button variant="ghost" size="sm" onClick={() => setAlert(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Alert>
                    )}
                    <Field>
                        <FieldLabel htmlFor="street">Rua</FieldLabel>
                        <Input id="street" value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-2">
                        <Field>
                            <FieldLabel htmlFor="city">Cidade</FieldLabel>
                            <Input id="city" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="state">Estado</FieldLabel>
                            <select
                                id="state"
                                value={form.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                                className="w-full rounded-md border bg-white dark:bg-zinc-900/50 h-10 px-2"
                            >
                                <option value="">Selecione</option>
                                {STATES.map((s) => (
                                    <option key={s.uf} value={s.uf}>
                                        {s.uf} — {s.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                        <Field>
                            <FieldLabel htmlFor="zip">CEP</FieldLabel>
                            <Input id="zip" value={form.zip} onChange={(e) => handleZipChange(e.target.value)} />
                            <div className="text-xs mt-1 text-zinc-600 dark:text-zinc-400">
                                {cepLoading ? 'Buscando CEP...' : cepError ? <span className="text-red-600 dark:text-red-400">{cepError}</span> : null}
                            </div>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="country">País</FieldLabel>
                            <Input id="country" value={form.country === 'BR' ? 'Brasil' : form.country} readOnly />
                        </Field>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={HandleSubmit} disabled={!isFormValid() || cepLoading}>Adicionar endereço</Button>
                    </div>
                </div>

                <div className="grid gap-2">
                    {addresses.length === 0 ? (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Nenhum endereço cadastrado.</p>
                    ) : (
                        addresses.map((a) => (
                            <div
                                key={a.id}
                                className="flex items-center justify-between gap-4 rounded-md border p-3 bg-white/50 dark:bg-zinc-900/50"
                            >
                                <div className="text-sm">
                                    <div className="font-medium">{a.street}</div>
                                    <div className="text-zinc-600 dark:text-zinc-400 text-xs">{[a.city, a.state, a.zip].filter(Boolean).join(" — ")}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => removeAddress(a.id)} className="text-red-600 dark:text-red-400">Remover</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => { if (!open) setConfirmDeleteId(null) }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remover endereço</AlertDialogTitle>
                            <AlertDialogDescription>Tem certeza que deseja remover este endereço?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConfirmDeleteId(null)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => confirmDeleteId && performDelete(confirmDeleteId)}>Remover</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}

"use client";

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatCpf } from "@/lib/formatters"
import Addresses from "@/components/addresses"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { X } from 'lucide-react'
interface ProfileFormProps {
  defaultValues?: {
    name: string
    email?: string
    cpf?: string
    avatar: string
    bio: string
    location?: string
    website?: string
    twitter?: string
    instagram?: string
  }
}

export default function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [cpf, setCpf] = useState(() => formatCpf(defaultValues?.cpf ?? ''))
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [email, setEmail] = useState(defaultValues?.email ?? '')
  const [tab, setTab] = useState<'profile' | 'addresses'>('profile')
  const [currentPassword, setCurrentPassword] = useState('')
  const [profileAlert, setProfileAlert] = useState<{ variant?: 'default' | 'destructive'; title?: string; description?: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)

  // change password state
  const [pwdCurrentForChange, setPwdCurrentForChange] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [pwdAlert, setPwdAlert] = useState<{ variant?: 'default' | 'destructive'; title?: string; description?: string } | null>(null)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login');
      return
    }

    // fetch current user profile and fill the form
    ;(async () => {
      try {
        const res = await fetch('http://localhost:3000/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (res.status === 401) {
          // session invalid or token malformed -> clear and force login
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()
        setName(data.name || '')
        setEmail(data.email || '')
        setCpf(formatCpf(data.cpf || ''))
      } catch (e) {
        console.error('Failed to load profile', e)
        setProfileAlert({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar seus dados.' })
      }
    })()
  }, [])

  useEffect(() => {
    let t: number | undefined
    if (profileAlert) t = window.setTimeout(() => setProfileAlert(null), 5000)
    return () => { if (t) clearTimeout(t) }
  }, [profileAlert])

  useEffect(() => {
    let t: number | undefined
    if (pwdAlert) t = window.setTimeout(() => setPwdAlert(null), 5000)
    return () => { if (t) clearTimeout(t) }
  }, [pwdAlert])

  function isProfileValid() {
    const cpfDigits = (cpf ?? '').replace(/\D/g, '')
    return Boolean(name?.trim() && email?.trim() && cpfDigits.length === 11)
  }

  async function saveProfile() {
    if (!isProfileValid()) {
      setProfileAlert({ variant: 'destructive', title: 'Erro', description: 'Preencha nome, email e CPF válido (11 dígitos).' })
      return
    }
    if (!currentPassword) {
      setProfileAlert({ variant: 'destructive', title: 'Erro', description: 'Digite sua senha atual para confirmar alterações.' })
      return
    }

    setSavingProfile(true)
    try {
      const token = localStorage.getItem('token')
      const payload = { name, email, cpf: (cpf ?? '').replace(/\D/g, ''), currentPassword }
      const res = await fetch('http://localhost:3000/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || 'Falha ao salvar perfil')
      }
      const data = await res.json()
      setName(data.name || '')
      setEmail(data.email || '')
      setCpf(formatCpf(data.cpf || ''))
      setCurrentPassword('')
      setProfileAlert({ variant: 'default', title: 'Sucesso', description: 'Perfil atualizado.' })
    } catch (e) {
      console.error('Failed to save profile', e)
      setProfileAlert({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar perfil.' })
    } finally {
      setSavingProfile(false)
    }
  }

  async function changePassword() {
    if (!pwdCurrentForChange || !newPassword) {
      setPwdAlert({ variant: 'destructive', title: 'Erro', description: 'Preencha sua senha atual e a nova senha.' })
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPwdAlert({ variant: 'destructive', title: 'Erro', description: 'A nova senha e confirmação não coincidem.' })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const payload = { currentPassword: pwdCurrentForChange, newPassword }
      const res = await fetch('http://localhost:3000/users/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || 'Falha ao alterar senha')
      }
      setPwdCurrentForChange('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPwdAlert({ variant: 'default', title: 'Sucesso', description: 'Senha alterada.' })
    } catch (e) {
      console.error('Failed to change password', e)
      setPwdAlert({ variant: 'destructive', title: 'Erro', description: 'Falha ao alterar senha.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="flex items-center justify-center gap-6">
          <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
            <AvatarImage src={defaultValues?.avatar} className="rounded-full object-cover" />
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900">SC</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="h-24 w-24 rounded-full border-2 border-dashed border-zinc-200/80 dark:border-zinc-800/80 
                             hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                             transition-colors shadow-sm"
          >
            <Sparkles className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          </Button>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 w-full text-center text-sm hover:cursor-pointer">
          Upload / Generate a new avatar
        </p>

        <div className="flex items-center justify-center gap-4 border-b pb-2">
          <Button
            variant={tab === 'profile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTab('profile')}
            className="px-3 py-1 rounded-md text-sm"
          >
            Perfil
          </Button>
          <Button
            variant={tab === 'addresses' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTab('addresses')}
            className="px-3 py-1 rounded-md text-sm"
          >
            Endereços
          </Button>
        </div>

        <div className="relative">
          <div
            aria-hidden={tab !== 'profile'}
            className={`transition-all duration-300 ease-in-out ${tab === 'profile'
                ? 'opacity-100 translate-y-0 relative'
                : 'opacity-0 -translate-y-2 pointer-events-none absolute inset-x-0 top-0'
              }`}
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                     focus:border-zinc-300 dark:focus:border-zinc-700
                                     focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                     focus:border-zinc-300 dark:focus:border-zinc-700
                                     focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpf" className="text-zinc-700 dark:text-zinc-300">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  autoComplete="off"
                  className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                     focus:border-zinc-300 dark:focus:border-zinc-700
                                     focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                     placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currentPassword" className="text-zinc-700 dark:text-zinc-300">
                  Senha atual (necessária para salvar alterações)
                </Label>
                <Input
                  id="currentPassword"
                  placeholder="Digite sua senha atual"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
                />
              </div>

              {profileAlert && (
                <Alert variant={profileAlert.variant} className="mb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <AlertTitle>{profileAlert.title}</AlertTitle>
                      {profileAlert.description && <AlertDescription>{profileAlert.description}</AlertDescription>}
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => setProfileAlert(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Alert>
              )}
            </div>
          </div>

          <div
            aria-hidden={tab !== 'addresses'}
            className={`transition-all duration-300 ease-in-out ${tab === 'addresses'
                ? 'opacity-100 translate-y-0 relative'
                : 'opacity-0 -translate-y-2 pointer-events-none absolute inset-x-0 top-0'
              }`}
          >
            <Addresses />
          </div>
        </div>
        <div className="grid gap-4 border-t pt-4">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Alterar senha</div>

          {pwdAlert && (
            <Alert variant={pwdAlert.variant} className="mb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <AlertTitle>{pwdAlert.title}</AlertTitle>
                  {pwdAlert.description && <AlertDescription>{pwdAlert.description}</AlertDescription>}
                </div>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => setPwdAlert(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid sm:grid-cols-3 gap-2">
            <Input placeholder="Senha atual" type="password" value={pwdCurrentForChange} onChange={(e) => setPwdCurrentForChange(e.target.value)} />
            <Input placeholder="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input placeholder="Confirmar nova senha" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.push('/')} className="text-zinc-700 dark:text-zinc-300 hover:bg-transparent">
              Voltar
            </Button>
            <Button
              variant="outline"
              className="border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              Cancel
            </Button>
            <Button onClick={changePassword} disabled={!pwdCurrentForChange || !newPassword || newPassword !== confirmNewPassword} className="mr-2">
              Alterar senha
            </Button>
            <Button onClick={saveProfile} disabled={!isProfileValid() || !currentPassword || savingProfile} className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
              {savingProfile ? 'Salvando...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

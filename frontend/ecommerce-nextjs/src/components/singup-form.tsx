"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  async function HandleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users/signUp", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          cpf,
          password,
        }),
      });
      if (response.ok) {
        setName("");
        setEmail("");
        setCpf("");
        setPassword("");
        router.push("/");
      } else
        throw new Error("deu erro no back");
    } catch (e) {
      if (e instanceof Error)
        console.log("deu erro aqui ó: ", e, ".");
      else
        console.log("o trem foi tao feio que ninguem sabe o que aconteceu.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>
            Preencha os campos para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="12345678911"
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirme sua senha
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" onClick={HandleSubmit} className="cursor-pointer">Create Account</Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <a href="/login">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

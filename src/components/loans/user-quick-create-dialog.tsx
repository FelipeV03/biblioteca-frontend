"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Mail, User as UserIcon, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateUser } from "@/hooks/useUsers";
import { ApiError } from "@/lib/api/client";
import { userFormSchema, type UserFormValues } from "@/lib/schemas/user.schema";
import type { User } from "@/types";

interface UserQuickCreateDialogProps {
  onCreated: (user: User) => void;
}

export function UserQuickCreateDialog({ onCreated }: UserQuickCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: "", email: "", documentNumber: "" },
  });

  async function onSubmit(values: UserFormValues) {
    try {
      const result = await createUser.mutateAsync(values);
      toast.success("Usuario creado correctamente");
      onCreated(result.data);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo crear el usuario");
    }
  }

  return (
    <>
      <Button type="button" variant="link" size="sm" className="h-auto p-0" onClick={() => setOpen(true)}>
        <UserPlus className="size-3.5" />
        Crear usuario nuevo
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex size-9 items-center justify-center rounded-lg border bg-primary/10 text-primary">
              <UserPlus className="size-4" />
            </div>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>Registra un nuevo lector en el sistema para poder asignarle préstamos.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              // El Dialog se renderiza en un portal: escapa del DOM del
              // formulario de prestamo, pero React sigue haciendo bubbling
              // del evento por el arbol de componentes. Sin esto, enviar
              // este formulario tambien disparaba la validacion/envio del
              // formulario de prestamo que lo contiene.
              event.stopPropagation();
              handleSubmit(onSubmit)(event);
            }}
            className="flex flex-col gap-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="quick-user-name">
                  <UserIcon className="size-3.5 text-muted-foreground" />
                  Nombre completo
                </FieldLabel>
                <Input
                  id="quick-user-name"
                  placeholder="Ej. Ana Martínez"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="quick-user-document">
                    <IdCard className="size-3.5 text-muted-foreground" />
                    Número de documento
                  </FieldLabel>
                  <Input
                    id="quick-user-document"
                    inputMode="numeric"
                    placeholder="Ej. 48920114"
                    className="font-mono"
                    aria-invalid={!!errors.documentNumber}
                    {...register("documentNumber")}
                  />
                  <FieldError errors={[errors.documentNumber]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="quick-user-email">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Email
                  </FieldLabel>
                  <Input
                    id="quick-user-email"
                    type="email"
                    placeholder="ana@email.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError errors={[errors.email]} />
                </Field>
              </div>
              <FieldDescription>El documento y el email deben ser únicos para cada usuario.</FieldDescription>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? "Creando..." : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

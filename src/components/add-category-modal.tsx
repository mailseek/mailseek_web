'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Category } from "../types/messages"
import { addCategory } from "../actions/users"

type CategoryForm = {
  name: string
  definition: string
}

type Props = {
  userId: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Category[]) => void
}

export default function AddCategoryModal(props: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>()

  const onSubmit = async (data: CategoryForm) => {
    const resp = await addCategory(props.userId, data)
    props.onSubmit(resp.categories)
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new category</DialogTitle>
          <DialogDescription>{"Your categories help you organize your emails."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input placeholder="Enter a name for your category" id="name" className="col-span-3" disabled={isSubmitting} {...register("name", { required: "Name is required" })} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-right">
                Definition
              </Label>
              <Textarea placeholder="Enter a definition that will help LLM understand your category" id="definition" className="col-span-3" disabled={isSubmitting} {...register("definition", { required: "Definition is required" })} />
            </div>
            {errors.name && <p className="text-sm text-red-500 col-start-2 col-span-3">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

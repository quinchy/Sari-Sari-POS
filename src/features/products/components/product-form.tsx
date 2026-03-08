"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormHeader from "@/components/layout/form-header";
import {
  ProductData as ProductFormData,
  ProductFormProps,
} from "@/features/products/types/products";
import { productSchema } from "../validation/products";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01FreeIcons, Delete01FreeIcons } from "@hugeicons/core-free-icons";
import { useCreateProduct } from "@/features/products/hooks/use-product";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

export default function ProductForm({
  product,
}: ProductFormProps) {
  const isEditing = !!product;

  const { isCreateProductPending, createProduct } =
    useCreateProduct();

  const isPending = isCreateProductPending;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditing
      ? {
          name: product.name,
          description: product.description ?? undefined,
          sku: product.sku ?? undefined,
          barcode: product.barcode ?? undefined,
          brand: product.brand ?? undefined,
          category: product.category ?? undefined,
          unit: product.unit ?? undefined,
          size: product.size ?? undefined,
          cost_price: product.cost_price ?? undefined,
          selling_price: product.selling_price,
          stock: product.stock,
          min_stock: product.min_stock,
          is_active: product.is_active,
          aliases: [],
        }
      : {
          name: "",
          description: "",
          sku: "",
          barcode: "",
          brand: "",
          category: "",
          unit: "",
          size: "",
          cost_price: undefined,
          selling_price: 0,
          stock: 0,
          min_stock: 0,
          is_active: true,
          aliases: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "aliases",
  });

  const onSubmit = (productData: ProductFormData) => {
    createProduct({
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      barcode: productData.barcode,
      brand: productData.brand,
      category: productData.category,
      unit: productData.unit,
      size: productData.size,
      cost_price: productData.cost_price,
      selling_price: productData.selling_price,
      stock: productData.stock,
      min_stock: productData.min_stock,
      is_active: productData.is_active,
      aliases: productData.aliases,
    });
  };

  return (
    <main className="space-y-5">
      <header>
        <FormHeader
          title={isEditing ? "Edit Product" : "Add Product"}
          description={
            isEditing
              ? "Edit your product details."
              : "Add a new product to your store."
          }
        />
      </header>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end gap-4"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel>
                <FieldTitle>Name</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  placeholder="Enter product name"
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                />
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel>
                <FieldTitle>Description</FieldTitle>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  placeholder="Enter product description"
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                />
              </FieldContent>
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4 w-full">
          <Controller
            control={form.control}
            name="sku"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>SKU</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="Enter SKU"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="barcode"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Barcode</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="Enter barcode"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Controller
            control={form.control}
            name="brand"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Brand</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="Enter brand"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Category</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="Enter category"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Controller
            control={form.control}
            name="unit"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Unit</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="e.g., pcs, kg, box"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="size"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Size</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    placeholder="e.g., small, medium, large"
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Controller
            control={form.control}
            name="cost_price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Cost Price</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter cost price"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? e.target.valueAsNumber : undefined,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="selling_price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Selling Price</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter selling price"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? e.target.valueAsNumber : undefined,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Controller
            control={form.control}
            name="stock"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Stock</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    placeholder="Enter stock quantity"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="min_stock"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  <FieldTitle>Minimum Stock</FieldTitle>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    placeholder="Enter minimum stock"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                  />
                </FieldContent>
              </Field>
            )}
          />
        </div>

        {/* Aliases Section */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <FieldTitle>Product Aliases</FieldTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "" })}
            >
              <HugeiconsIcon
                icon={Add01FreeIcons}
                size={18}
                color="currentColor"
              />
              Add Alias
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Controller
                  control={form.control}
                  name={`aliases.${index}.name` as const}
                  render={({ field: aliasField, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex-1 mb-0"
                    >
                      <FieldContent>
                        <Input
                          type="text"
                          placeholder="Enter alias name"
                          onChange={(e) =>
                            aliasField.onChange(e.target.value)
                          }
                          onBlur={aliasField.onBlur}
                          name={aliasField.name}
                          ref={aliasField.ref}
                          value={aliasField.value ?? ""}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <HugeiconsIcon
                    icon={Delete01FreeIcons}
                    size={18}
                    color="currentColor"
                  />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Submitting
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </main>
  );
}

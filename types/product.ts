/**
 * Estructura alineada con public/products.json
 */
export type Product = {
  id: number
  name: string
  /** Filtro principal (ej: categoría, marca, colección, etc). */
  param1: string
  /** Filtro secundario (ej: subtipo, género, estilo, etc). */
  param2: string
  /** Tercer filtro opcional para refinado adicional. */
  param3: string
  price: number
  image: string
  /** Galería adicional; si no existe, se usa solo `image`. */
  images?: string[]
  description?: string
  /** Indica si el producto está agotado. */
  soldOut: boolean
}

export type ProductInput = {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  description?: string
  /** Nuevo modelo flexible */
  param1?: string
  param2?: string
  param3?: string
  /** Compatibilidad con datasets anteriores */
  category?: string
  subCategory?: string
  soldOut?: boolean
}

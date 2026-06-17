import { useEffect, useMemo, useState } from "react";
import { config } from "@/data/config";
import type { Product, ProductInput } from "@/types/product";
import { normalizeProduct } from "@/lib/product-helpers";

type FilterOption = {
  value: string;
  count: number;
};

type FilterGroups = {
  param1: FilterOption[];
  param2: FilterOption[];
  param3: FilterOption[];
  soldOut: FilterOption[];
};

const ALL_FILTER = config.catalogo.allFilterLabel;
const PRODUCTS_URL = config.productList.productsJsonUrl;

const buildFilterGroup = (values: string[]): FilterOption[] => {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
};

const buildBooleanFilterGroup = (values: boolean[]): FilterOption[] => {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    const key = value ? "Agotado" : "Disponible";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
};

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeParam1, setActiveParam1] = useState(ALL_FILTER);
  const [activeParam2, setActiveParam2] = useState(ALL_FILTER);
  const [activeParam3, setActiveParam3] = useState(ALL_FILTER);
  const [activeSoldOut, setActiveSoldOut] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_URL);
        const data = (await res.json()) as ProductInput[];
        setAllProducts(data.map(normalizeProduct));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filterGroups = useMemo<FilterGroups>(() => {
    return {
      param1: buildFilterGroup(allProducts.map((product) => product.param1)),
      param2: buildFilterGroup(allProducts.map((product) => product.param2)),
      param3: buildFilterGroup(allProducts.map((product) => product.param3)),
      soldOut: buildBooleanFilterGroup(allProducts.map((product) => product.soldOut)),
    };
  }, [allProducts]);

  const filteredProducts = allProducts.filter((product) => {
    const param1Match =
      activeParam1 === ALL_FILTER || product.param1 === activeParam1;

    const param2Match =
      activeParam2 === ALL_FILTER || product.param2 === activeParam2;

    const param3Match =
      activeParam3 === ALL_FILTER || product.param3 === activeParam3;

    const soldOutMatch =
      activeSoldOut === null || product.soldOut === activeSoldOut;

    return param1Match && param2Match && param3Match && soldOutMatch;
  });

  return {
    products: filteredProducts,
    filterGroups,
    setActiveParam1,
    setActiveParam2,
    setActiveParam3,
    setActiveSoldOut,
    activeParam1,
    activeParam2,
    activeParam3,
    activeSoldOut,
    loading,
  };
}
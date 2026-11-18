"use client";

import { useEffect, useState } from "react";
import {
  SignatureScentCard,
  type SignatureScentPerfume,
} from "../signature-scent-carousel";
import { SHOP_MODE_NAVIGATION_EVENT } from "./shop-mode-link";

type RetailSize = {
  ml: number;
  retail: number;
};

type WholesaleSize = {
  ml: number;
  wholesale: number;
  unit: 1 | 12;
};

type ShopScent = {
  perfume: SignatureScentPerfume;
  group: string;
  comingSoon: boolean;
};

type CartItem = {
  kind: "single" | "mix";
  scents: string[];
  sizeMl: number;
  unitPrice: number;
  quantity: number;
};

type WholesaleCartItem = {
  kind: "single" | "mix";
  scents: string[];
  sizeMl: number;
  unitPrice: number;
  priceUnit: 1 | 12;
  dozens: number;
};

type LegacyWholesaleCartItem = {
  kind: "wholesale";
  scent: string;
  sizeMl: number;
  unitPrice: number;
  priceUnit: 1 | 12;
  dozens: number;
};

type ShopFilter = "all" | "him" | "her" | "coming-soon";
type PurchaseMode = "single" | "mix";
type OrderMode = "retail" | "wholesale";

type ShopOrderFormProps = {
  scents: ShopScent[];
  sizes: RetailSize[];
  wholesaleSizes: WholesaleSize[];
  wholesaleMinimum: number;
  whatsappNumber: string;
};

const CART_STORAGE_KEY = "lulu-kaya-shop-cart-v1";
const WHOLESALE_CART_STORAGE_KEY = "lulu-kaya-shop-wholesale-cart-v1";

const filters: { id: ShopFilter; label: string }[] = [
  { id: "all", label: "All scents" },
  { id: "him", label: "For him" },
  { id: "her", label: "For her" },
  { id: "coming-soon", label: "Coming soon" },
];

const formatUgx = (amount: number) => amount.toLocaleString("en-UG");
const cartItemKey = (item: Pick<CartItem, "kind" | "scents" | "sizeMl">) =>
  JSON.stringify([item.kind, item.sizeMl, [...item.scents].sort()]);
const wholesaleCartItemKey = (
  item: Pick<WholesaleCartItem, "kind" | "scents" | "sizeMl">,
) => JSON.stringify([item.kind, item.sizeMl, [...item.scents].sort()]);
const wholesaleItemTotal = (item: WholesaleCartItem) =>
  item.unitPrice * item.dozens * (item.priceUnit === 1 ? 12 : 1);
const maxWholesaleDozens = (unitPrice: number, priceUnit: 1 | 12) =>
  Math.floor(Number.MAX_SAFE_INTEGER / (unitPrice * (priceUnit === 1 ? 12 : 1)));
const validQuantity = (value: string) => {
  const quantity = Number(value);
  return Number.isSafeInteger(quantity) && quantity > 0 ? quantity : null;
};
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const isPositiveSafeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const isCartItem = (value: unknown): value is CartItem => {
  if (!isRecord(value)) {
    return false;
  }

  const { kind, scents, sizeMl, unitPrice, quantity } = value;

  if (
    (kind !== "single" && kind !== "mix") ||
    !Array.isArray(scents) ||
    !scents.every(isNonEmptyString) ||
    (kind === "single" ? scents.length !== 1 : scents.length < 2) ||
    new Set(scents).size !== scents.length
  ) {
    return false;
  }

  return (
    isPositiveSafeInteger(sizeMl) &&
    isPositiveSafeInteger(unitPrice) &&
    isPositiveSafeInteger(quantity)
  );
};

const isWholesaleCartItem = (value: unknown): value is WholesaleCartItem => {
  if (!isRecord(value)) {
    return false;
  }

  const { kind, scents, sizeMl, unitPrice, priceUnit, dozens } = value;

  if (
    (kind !== "single" && kind !== "mix") ||
    !Array.isArray(scents) ||
    !scents.every(isNonEmptyString) ||
    (kind === "single" ? scents.length !== 1 : scents.length < 2) ||
    new Set(scents).size !== scents.length ||
    !isPositiveSafeInteger(sizeMl) ||
    !isPositiveSafeInteger(unitPrice) ||
    (priceUnit !== 1 && priceUnit !== 12) ||
    !isPositiveSafeInteger(dozens)
  ) {
    return false;
  }

  return dozens <= maxWholesaleDozens(unitPrice, priceUnit);
};

const isLegacyWholesaleCartItem = (
  value: unknown,
): value is LegacyWholesaleCartItem =>
  isRecord(value) &&
  value.kind === "wholesale" &&
  isNonEmptyString(value.scent) &&
  isPositiveSafeInteger(value.sizeMl) &&
  isPositiveSafeInteger(value.unitPrice) &&
  (value.priceUnit === 1 || value.priceUnit === 12) &&
  isPositiveSafeInteger(value.dozens) &&
  value.dozens <= maxWholesaleDozens(value.unitPrice, value.priceUnit);

const readSavedCart = (
  serializedCart: string,
  availableScents: ShopScent[],
  availableSizes: RetailSize[],
): CartItem[] => {
  let savedData: unknown;

  try {
    savedData = JSON.parse(serializedCart);
  } catch {
    throw new Error("Saved cart data was invalid and has been cleared.");
  }

  if (
    !isRecord(savedData) ||
    savedData.version !== 1 ||
    !Array.isArray(savedData.items)
  ) {
    throw new Error("Saved cart data was incompatible and has been cleared.");
  }

  const knownScents = new Set(
    availableScents.map(({ perfume }) => perfume.name),
  );
  const savedItems: unknown[] = savedData.items;
  const restoredItems: CartItem[] = [];

  for (const savedItem of savedItems) {
    if (!isCartItem(savedItem)) {
      throw new Error("Saved cart data was invalid and has been cleared.");
    }

    const size = availableSizes.find(({ ml }) => ml === savedItem.sizeMl);
    const scentsAreAvailable = savedItem.scents.every((name) =>
      knownScents.has(name),
    );

    if (!size || size.retail !== savedItem.unitPrice || !scentsAreAvailable) {
      throw new Error("Saved cart data was outdated and has been cleared.");
    }

    restoredItems.push(savedItem);
  }

  return restoredItems;
};

const readSavedWholesaleCart = (
  serializedCart: string,
  availableScents: ShopScent[],
  availableSizes: WholesaleSize[],
): WholesaleCartItem[] => {
  let savedData: unknown;

  try {
    savedData = JSON.parse(serializedCart);
  } catch {
    throw new Error("Saved wholesale cart data was invalid and has been cleared.");
  }

  if (
    !isRecord(savedData) ||
    (savedData.version !== 1 && savedData.version !== 2) ||
    !Array.isArray(savedData.items)
  ) {
    throw new Error("Saved wholesale cart data was incompatible and has been cleared.");
  }

  const knownScents = new Set(
    availableScents.map(({ perfume }) => perfume.name),
  );
  const savedItems: unknown[] = savedData.items;
  const restoredItems: WholesaleCartItem[] = [];

  for (const savedItem of savedItems) {
    let restoredItem: WholesaleCartItem;

    if (savedData.version === 1) {
      if (!isLegacyWholesaleCartItem(savedItem)) {
        throw new Error("Saved wholesale cart data was invalid and has been cleared.");
      }

      restoredItem = {
        kind: "single",
        scents: [savedItem.scent],
        sizeMl: savedItem.sizeMl,
        unitPrice: savedItem.unitPrice,
        priceUnit: savedItem.priceUnit,
        dozens: savedItem.dozens,
      };
    } else {
      if (!isWholesaleCartItem(savedItem)) {
        throw new Error("Saved wholesale cart data was invalid and has been cleared.");
      }

      restoredItem = savedItem;
    }

    const size = availableSizes.find(({ ml }) => ml === restoredItem.sizeMl);

    if (
      !size ||
      size.wholesale !== restoredItem.unitPrice ||
      size.unit !== restoredItem.priceUnit ||
      !restoredItem.scents.every((scent) => knownScents.has(scent))
    ) {
      throw new Error("Saved wholesale cart data was outdated and has been cleared.");
    }

    restoredItems.push(restoredItem);
  }

  return restoredItems;
};

export default function ShopOrderForm({
  scents,
  sizes,
  wholesaleSizes,
  wholesaleMinimum,
  whatsappNumber,
}: ShopOrderFormProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ShopFilter>("all");
  const [orderMode, setOrderMode] = useState<OrderMode>("retail");
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("single");
  const [selectedSizeByScent, setSelectedSizeByScent] = useState<Record<string, number>>({});
  const [selectedWholesaleSizeByScent, setSelectedWholesaleSizeByScent] =
    useState<Record<string, number>>({});
  const [quantityByScent, setQuantityByScent] = useState<Record<string, string>>({});
  const [wholesaleQuantityByScent, setWholesaleQuantityByScent] =
    useState<Record<string, string>>({});
  const [selectedMixScentIds, setSelectedMixScentIds] = useState<string[]>([]);
  const [selectedMixSizeMl, setSelectedMixSizeMl] = useState<number | undefined>(
    sizes[0]?.ml,
  );
  const [selectedWholesaleMixSizeMl, setSelectedWholesaleMixSizeMl] =
    useState<number | undefined>(wholesaleSizes[0]?.ml);
  const [mixQuantity, setMixQuantity] = useState("1");
  const [wholesaleMixQuantity, setWholesaleMixQuantity] = useState("1");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wholesaleCart, setWholesaleCart] = useState<WholesaleCartItem[]>([]);
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const syncOrderModeWithHash = () => {
      if (window.location.hash === "#wholesale") {
        setOrderMode("wholesale");
      } else if (window.location.hash === "#retail") {
        setOrderMode("retail");
      }
    };
    const syncOrderModeWithNavigation = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (event.detail === "retail" || event.detail === "wholesale") {
        setOrderMode(event.detail);
      }
    };

    syncOrderModeWithHash();
    window.addEventListener("hashchange", syncOrderModeWithHash);
    window.addEventListener(SHOP_MODE_NAVIGATION_EVENT, syncOrderModeWithNavigation);

    return () => {
      window.removeEventListener("hashchange", syncOrderModeWithHash);
      window.removeEventListener(
        SHOP_MODE_NAVIGATION_EVENT,
        syncOrderModeWithNavigation,
      );
    };
  }, []);

  useEffect(() => {
    let serializedCart: string | null;
    let serializedWholesaleCart: string | null;

    try {
      serializedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      serializedWholesaleCart = window.localStorage.getItem(
        WHOLESALE_CART_STORAGE_KEY,
      );
    } catch {
      setCartMessage(
        "Saved cart storage is unavailable. Your carts may not persist after a refresh.",
      );
      setIsCartHydrated(true);
      return;
    }

    const restoreMessages: string[] = [];

    if (serializedCart) {
      try {
        const restoredCart = readSavedCart(serializedCart, scents, sizes);
        setCart(restoredCart);
        if (restoredCart.length > 0) {
          restoreMessages.push("Your saved retail cart has been restored.");
        }
      } catch (error) {
        restoreMessages.push(
          error instanceof Error ? error.message : "Your saved retail cart could not be restored.",
        );
      }
    }

    if (serializedWholesaleCart) {
      try {
        const restoredCart = readSavedWholesaleCart(
          serializedWholesaleCart,
          scents,
          wholesaleSizes,
        );
        setWholesaleCart(restoredCart);
        if (restoredCart.length > 0) {
          restoreMessages.push("Your saved wholesale cart has been restored.");
        }
      } catch (error) {
        restoreMessages.push(
          error instanceof Error
            ? error.message
            : "Your saved wholesale cart could not be restored.",
        );
      }
    }

    if (restoreMessages.length > 0) {
      setCartMessage(restoreMessages.join(" "));
    }

    setIsCartHydrated(true);
  }, [scents, sizes, wholesaleSizes]);

  useEffect(() => {
    if (!isCartHydrated) {
      return;
    }

    try {
      if (cart.length === 0) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ version: 1, items: cart }),
      );
    } catch {
      setCartMessage(
        "Your cart could not be saved in this browser and may be lost after a refresh.",
      );
    }
  }, [cart, isCartHydrated]);

  useEffect(() => {
    if (!isCartHydrated) {
      return;
    }

    try {
      if (wholesaleCart.length === 0) {
        window.localStorage.removeItem(WHOLESALE_CART_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(
        WHOLESALE_CART_STORAGE_KEY,
        JSON.stringify({ version: 2, items: wholesaleCart }),
      );
    } catch {
      setCartMessage(
        "Your wholesale cart could not be saved in this browser and may be lost after a refresh.",
      );
    }
  }, [wholesaleCart, isCartHydrated]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredScents = scents.filter(({ perfume, group, comingSoon }) => {
    const matchesQuery = perfume.name.toLowerCase().includes(normalizedQuery);
    const matchesFilter =
      filter === "all" ||
      (filter === "him" && group === "m") ||
      (filter === "her" && group === "w") ||
      (filter === "coming-soon" && comingSoon);

    return matchesQuery && matchesFilter;
  });
  const selectedMixScents = scents.filter(({ perfume }) =>
    selectedMixScentIds.includes(perfume.id),
  );
  const selectedMixSize =
    sizes.find(({ ml }) => ml === selectedMixSizeMl) ?? sizes[0];
  const selectedWholesaleMixSize =
    wholesaleSizes.find(({ ml }) => ml === selectedWholesaleMixSizeMl) ??
    wholesaleSizes[0];
  const parsedMixQuantity = validQuantity(mixQuantity);
  const parsedWholesaleMixQuantity = validQuantity(wholesaleMixQuantity);
  const retailCartTotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const retailCartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const wholesaleCartTotal = wholesaleCart.reduce(
    (total, item) => total + wholesaleItemTotal(item),
    0,
  );
  const wholesaleCartCount = wholesaleCart.reduce(
    (count, item) => count + item.dozens * 12,
    0,
  );
  const activeCartTotal =
    orderMode === "wholesale" ? wholesaleCartTotal : retailCartTotal;
  const activeCartCount =
    orderMode === "wholesale" ? wholesaleCartCount : retailCartCount;
  const retailOrderMessage = [
    "Hello Lulu Kaya, I would like to order:",
    ...cart.map((item) => {
      const description =
        item.kind === "mix"
          ? `Mixed in one bottle (${item.scents.join(" + ")}, ${item.sizeMl} ml)`
          : `${item.scents.join(" + ")} (${item.sizeMl} ml)`;
      return `- ${item.quantity} x ${description}: UGX ${formatUgx(item.unitPrice * item.quantity)}`;
    }),
    `Total: UGX ${formatUgx(retailCartTotal)}`,
    "Please confirm my order. Thank you.",
  ].join("\n");
  const wholesaleOrderMessage = [
    "Hello Lulu Kaya, I would like to place a wholesale order:",
    ...wholesaleCart.map((item) => {
      const description =
        item.kind === "mix"
          ? `a blend of ${item.scents.join(" + ")} (${item.sizeMl} ml)`
          : `${item.scents.join(" + ")} (${item.sizeMl} ml)`;
      const priceDescription =
        item.priceUnit === 12
          ? `UGX ${formatUgx(item.unitPrice)} per dozen`
          : `UGX ${formatUgx(item.unitPrice)} per bottle`;
      return `- ${item.dozens} dozen (${item.dozens * 12} bottles) of ${description}, ${priceDescription}: UGX ${formatUgx(wholesaleItemTotal(item))}`;
    }),
    `Wholesale total: UGX ${formatUgx(wholesaleCartTotal)}`,
    "Please confirm my order. Thank you.",
  ].join("\n");
  const orderMessage =
    orderMode === "wholesale" ? wholesaleOrderMessage : retailOrderMessage;
  const canCheckout =
    orderMode === "retail"
      ? cart.length > 0
      : wholesaleCart.length > 0 && wholesaleCartTotal >= wholesaleMinimum;
  const whatsappHref =
    canCheckout
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`
      : null;

  const addToCart = (
    kind: CartItem["kind"],
    scentNames: string[],
    size: RetailSize | undefined,
    quantity: number | null,
  ) => {
    if (!size) {
      setCartMessage("Choose an available bottle size first.");
      return false;
    }

    if (kind === "mix" && scentNames.length < 2) {
      setCartMessage("Choose at least two scents for a blend.");
      return false;
    }

    if (quantity === null) {
      setCartMessage("Enter a whole quantity of one or more bottles.");
      return false;
    }

    const item: CartItem = {
      kind,
      scents: kind === "mix" ? [...scentNames].sort() : [scentNames[0] ?? ""],
      sizeMl: size.ml,
      unitPrice: size.retail,
      quantity,
    };
    const itemKey = cartItemKey(item);
    const existing = cart.find((cartItem) => cartItemKey(cartItem) === itemKey);

    if (existing && quantity > Number.MAX_SAFE_INTEGER - existing.quantity) {
      setCartMessage("That quantity is too large to add to your cart.");
      return false;
    }

    setCart((items) => {
      const matchingItem = items.find(
        (cartItem) => cartItemKey(cartItem) === itemKey,
      );

      if (matchingItem) {
        return items.map((cartItem) =>
          cartItemKey(cartItem) === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      }

      return [...items, item];
    });

    const description =
      kind === "mix" ? "Blended bottle" : `${item.scents.join(" + ")}`;
    setCartMessage(
      `${quantity} ${quantity === 1 ? "bottle" : "bottles"} of ${description} added to your cart.`,
    );
    return true;
  };

  const addSingleScent = (
    perfume: SignatureScentPerfume,
    size: RetailSize | undefined,
    quantityText: string,
  ) => {
    if (addToCart("single", [perfume.name], size, validQuantity(quantityText))) {
      setQuantityByScent((current) => ({ ...current, [perfume.id]: "1" }));
    }
  };

  const addMix = () => {
    const scentNames = selectedMixScents.map(({ perfume }) => perfume.name);
    const wasAdded =
      orderMode === "wholesale"
        ? addWholesaleToCart(
            "mix",
            scentNames,
            selectedWholesaleMixSize,
            parsedWholesaleMixQuantity,
          )
        : addToCart("mix", scentNames, selectedMixSize, parsedMixQuantity);

    if (wasAdded) {
      setSelectedMixScentIds([]);
      setMixQuantity("1");
      setWholesaleMixQuantity("1");
    }
  };

  const addWholesaleToCart = (
    kind: WholesaleCartItem["kind"],
    scentNames: string[],
    size: WholesaleSize | undefined,
    dozens: number | null,
  ): boolean => {
    if (!size) {
      setCartMessage("Choose an available wholesale bottle size first.");
      return false;
    }

    if (kind === "mix" && scentNames.length < 2) {
      setCartMessage("Choose at least two scents for a blend.");
      return false;
    }

    const maxDozens = maxWholesaleDozens(size.wholesale, size.unit);
    if (dozens === null || dozens > maxDozens) {
      setCartMessage("Enter a whole quantity of one or more dozens.");
      return false;
    }

    const item: WholesaleCartItem = {
      kind,
      scents: kind === "mix" ? [...scentNames].sort() : [scentNames[0] ?? ""],
      sizeMl: size.ml,
      unitPrice: size.wholesale,
      priceUnit: size.unit,
      dozens,
    };
    const itemKey = wholesaleCartItemKey(item);
    const existing = wholesaleCart.find(
      (cartItem) => wholesaleCartItemKey(cartItem) === itemKey,
    );

    if (existing && dozens > maxDozens - existing.dozens) {
      setCartMessage("That wholesale quantity is too large to add to your cart.");
      return false;
    }

    setWholesaleCart((items) => {
      const matchingItem = items.find(
        (cartItem) => wholesaleCartItemKey(cartItem) === itemKey,
      );

      if (matchingItem) {
        return items.map((cartItem) =>
          wholesaleCartItemKey(cartItem) === itemKey
            ? { ...cartItem, dozens: cartItem.dozens + dozens }
            : cartItem,
        );
      }

      return [...items, item];
    });

    const description =
      kind === "mix"
      ? `blended bottles (${item.scents.join(" + ")})`
        : item.scents.join(" + ");
    setCartMessage(
      `${dozens} dozen (${dozens * 12} bottles) of ${description} (${size.ml} ml) added to your wholesale cart.`,
    );
    return true;
  };

  const addWholesaleScent = (
    perfume: SignatureScentPerfume,
    size: WholesaleSize | undefined,
    quantityText: string,
  ) => {
    if (
      addWholesaleToCart(
        "single",
        [perfume.name],
        size,
        validQuantity(quantityText),
      )
    ) {
      setWholesaleQuantityByScent((current) => ({
        ...current,
        [perfume.id]: "1",
      }));
    }
  };

  const toggleMixScent = (id: string) => {
    setSelectedMixScentIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const changeCartQuantity = (item: CartItem, change: -1 | 1) => {
    const itemKey = cartItemKey(item);
    setCart((items) =>
      items.map((cartItem) =>
        cartItemKey(cartItem) === itemKey
          ? {
              ...cartItem,
              quantity:
                change === 1
                  ? Math.min(Number.MAX_SAFE_INTEGER, cartItem.quantity + 1)
                  : Math.max(1, cartItem.quantity - 1),
            }
          : cartItem,
      ),
    );
  };

  const changeWholesaleCartQuantity = (
    item: WholesaleCartItem,
    change: -1 | 1,
  ) => {
    const itemKey = wholesaleCartItemKey(item);
    const maxDozens = maxWholesaleDozens(item.unitPrice, item.priceUnit);
    setWholesaleCart((items) =>
      items.map((cartItem) =>
        wholesaleCartItemKey(cartItem) === itemKey
          ? {
              ...cartItem,
              dozens:
                change === 1
                  ? Math.min(maxDozens, cartItem.dozens + 1)
                  : Math.max(1, cartItem.dozens - 1),
            }
          : cartItem,
      ),
    );
  };

  const removeCartItem = (item: CartItem) => {
    const itemKey = cartItemKey(item);
    setCart((items) =>
      items.filter((cartItem) => cartItemKey(cartItem) !== itemKey),
    );
    const description =
      item.kind === "mix" ? "blended bottle" : item.scents.join(" + ");
    setCartMessage(
      `${description} (${item.sizeMl} ml) removed from your cart.`,
    );
  };

  const removeWholesaleCartItem = (item: WholesaleCartItem) => {
    const itemKey = wholesaleCartItemKey(item);
    setWholesaleCart((items) =>
      items.filter((cartItem) => wholesaleCartItemKey(cartItem) !== itemKey),
    );
    setCartMessage(
      `${item.scents.join(" + ")} (${item.sizeMl} ml) removed from your wholesale cart.`,
    );
  };

  const changeOrderMode = (mode: OrderMode) => {
    setOrderMode(mode);
    if (window.location.hash !== `#${mode}`) {
      window.history.replaceState(null, "", `#${mode}`);
    }
  };

  return (
    <section className="shop-order" aria-label="Choose perfumes and add them to your cart">
      <div className="shop-order-type">
        <div className="shop-order-type-controls">
          <span className="shop-order-type-label">Order type</span>
          <div
            aria-label="Choose retail or wholesale"
            className="shop-order-type-switch"
            role="group"
          >
            <button
              id="retail"
              aria-pressed={orderMode === "retail"}
              onClick={() => changeOrderMode("retail")}
              type="button"
            >
              Retail
            </button>
            <button
              id="wholesale"
              aria-pressed={orderMode === "wholesale"}
              onClick={() => changeOrderMode("wholesale")}
              type="button"
            >
              Wholesale
            </button>
          </div>
        </div>
        {orderMode === "wholesale" && (
          <p className="shop-wholesale-guidance">
            Wholesale minimum: UGX {formatUgx(wholesaleMinimum)}. Each scent
            selection is ordered by the dozen (12 bottles). Smaller orders are
            sold at retail prices.
          </p>
        )}
      </div>

      <div className="shop-catalog">
        <div className="shop-catalog-heading">
          <div>
            <h2>Explore all scents</h2>
            <p>
              {filteredScents.length === scents.length
                ? `${scents.length} perfumes`
                : `${filteredScents.length} of ${scents.length} perfumes`}
            </p>
          </div>
          <label className="shop-search" htmlFor="shop-scent-search">
            <span>Search perfumes</span>
            <span className="shop-search-field">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
              <input
                autoComplete="off"
                id="shop-scent-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name"
                type="search"
                value={query}
              />
            </span>
          </label>
        </div>

        <div className="shop-order-options">
          <div aria-label="Choose bottle style" className="shop-mode-switch" role="group">
            <button
              aria-pressed={purchaseMode === "single"}
              onClick={() => setPurchaseMode("single")}
              type="button"
            >
              One scent per bottle
            </button>
            <button
              aria-pressed={purchaseMode === "mix"}
              onClick={() => setPurchaseMode("mix")}
              type="button"
            >
              Mix scents in one bottle
            </button>
          </div>
          <div aria-label="Filter scents" className="shop-filters" role="group">
            {filters.map(({ id, label }) => (
              <button
                aria-pressed={filter === id}
                key={id}
                onClick={() => setFilter(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="shop-cart-message">{cartMessage}</p>

        {purchaseMode === "mix" && (
          <section aria-labelledby="shop-mix-title" className="shop-mix-builder">
            <div className="shop-mix-builder-copy">
              <h3 id="shop-mix-title">Build your bottle</h3>
              <p>
                Choose at least two scents to blend. The bottle costs the same
                as a single scent in the selected size.
              </p>
              <p aria-live="polite" className="shop-mix-count">
                {selectedMixScentIds.length} selected
              </p>
              {selectedMixScents.length > 0 && (
                <ul className="shop-mix-selection">
                  {selectedMixScents.map(({ perfume }) => (
                    <li key={perfume.id}>
                      <span>{perfume.name}</span>
                      <button
                        aria-label={`Remove ${perfume.name} from blend`}
                        onClick={() => toggleMixScent(perfume.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="shop-mix-options">
              <label className="shop-card-size">
                <span>Bottle size</span>
                <select
                  aria-label="Bottle size for blended scent"
                  disabled={
                    orderMode === "wholesale"
                      ? wholesaleSizes.length === 0
                      : sizes.length === 0
                  }
                  onChange={(event) => {
                    if (orderMode === "wholesale") {
                      setSelectedWholesaleMixSizeMl(Number(event.target.value));
                    } else {
                      setSelectedMixSizeMl(Number(event.target.value));
                    }
                  }}
                  value={
                    orderMode === "wholesale"
                      ? selectedWholesaleMixSize?.ml ?? ""
                      : selectedMixSize?.ml ?? ""
                  }
                >
                  {orderMode === "wholesale"
                    ? wholesaleSizes.map(({ ml, wholesale, unit }) => (
                        <option key={ml} value={ml}>
                          {ml} ml - UGX {formatUgx(wholesale)} {unit === 12 ? "per dozen" : "per bottle"}
                        </option>
                      ))
                    : sizes.map(({ ml, retail }) => (
                        <option key={ml} value={ml}>
                          {ml} ml - UGX {formatUgx(retail)}
                        </option>
                      ))}
                </select>
              </label>
              <label className="shop-card-quantity">
                <span>{orderMode === "wholesale" ? "Quantity (dozens)" : "Quantity"}</span>
                <input
                  aria-label={
                    orderMode === "wholesale"
                      ? "Number of blended dozens"
                      : "Number of blended bottles"
                  }
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => {
                    if (orderMode === "wholesale") {
                      setWholesaleMixQuantity(event.target.value);
                    } else {
                      setMixQuantity(event.target.value);
                    }
                  }}
                  step="1"
                  type="number"
                  value={
                    orderMode === "wholesale"
                      ? wholesaleMixQuantity
                      : mixQuantity
                  }
                />
              </label>
              <p className="shop-mix-price">
                <span>{orderMode === "wholesale" ? "Wholesale price" : "Price per bottle"}</span>
                <strong>
                  {orderMode === "wholesale"
                    ? selectedWholesaleMixSize
                      ? selectedWholesaleMixSize.unit === 12
                        ? `UGX ${formatUgx(selectedWholesaleMixSize.wholesale)} per dozen`
                        : `UGX ${formatUgx(selectedWholesaleMixSize.wholesale)} per bottle · 12 bottles: UGX ${formatUgx(selectedWholesaleMixSize.wholesale * 12)}`
                      : "Unavailable"
                    : selectedMixSize
                      ? `UGX ${formatUgx(selectedMixSize.retail)}`
                      : "Unavailable"}
                </strong>
              </p>
              <button
                className="btn shop-card-add shop-mix-add"
                disabled={
                  !isCartHydrated ||
                  selectedMixScents.length < 2 ||
                  (orderMode === "wholesale"
                    ? !selectedWholesaleMixSize ||
                      parsedWholesaleMixQuantity === null
                    : !selectedMixSize || parsedMixQuantity === null)
                }
                onClick={addMix}
                type="button"
              >
                Add blend to cart
              </button>
            </div>
          </section>
        )}

        {filteredScents.length > 0 ? (
          <div className="shop-perfume-grid">
            {filteredScents.map(({ perfume, comingSoon }) => {
              const selectedSizeMl =
                selectedSizeByScent[perfume.id] ?? sizes[0]?.ml;
              const selectedSize = sizes.find(({ ml }) => ml === selectedSizeMl);
              const selectedWholesaleSizeMl =
                selectedWholesaleSizeByScent[perfume.id] ?? wholesaleSizes[0]?.ml;
              const selectedWholesaleSize = wholesaleSizes.find(
                ({ ml }) => ml === selectedWholesaleSizeMl,
              );
              const retailQuantityText = quantityByScent[perfume.id] ?? "1";
              const wholesaleQuantityText =
                wholesaleQuantityByScent[perfume.id] ?? "1";
              const quantityText =
                orderMode === "wholesale"
                  ? wholesaleQuantityText
                  : retailQuantityText;
              const quantity = validQuantity(quantityText);
              const selectedForMix =
                purchaseMode === "mix" &&
                selectedMixScentIds.includes(perfume.id);

              return (
                <SignatureScentCard
                  className={`shop-perfume-card${selectedForMix ? " is-selected" : ""}`}
                  key={perfume.id}
                  perfume={perfume}
                  showNotes={false}
                >
                  <div className="shop-perfume-controls">
                    {purchaseMode === "single" ? (
                      <>
                        <div className="shop-card-inputs">
                          <label className="shop-card-size">
                            <span>Size</span>
                            <select
                              aria-label={`Size and price for ${perfume.name}`}
                              disabled={
                                comingSoon ||
                                (orderMode === "wholesale"
                                  ? wholesaleSizes.length === 0
                                  : sizes.length === 0)
                              }
                              onChange={(event) => {
                                const sizeMl = Number(event.target.value);
                                if (orderMode === "wholesale") {
                                  setSelectedWholesaleSizeByScent((current) => ({
                                    ...current,
                                    [perfume.id]: sizeMl,
                                  }));
                                } else {
                                  setSelectedSizeByScent((current) => ({
                                    ...current,
                                    [perfume.id]: sizeMl,
                                  }));
                                }
                              }}
                              value={
                                orderMode === "wholesale"
                                  ? selectedWholesaleSize?.ml ?? ""
                                  : selectedSize?.ml ?? ""
                              }
                            >
                              {orderMode === "wholesale"
                                ? wholesaleSizes.map(({ ml, wholesale, unit }) => (
                                    <option key={ml} value={ml}>
                                      {ml} ml - UGX {formatUgx(wholesale)} {unit === 12 ? "per dozen" : "per bottle"}
                                    </option>
                                  ))
                                : sizes.map(({ ml, retail }) => (
                                    <option key={ml} value={ml}>
                                      {ml} ml - UGX {formatUgx(retail)}
                                    </option>
                                  ))}
                            </select>
                          </label>
                          <label className="shop-card-quantity">
                            <span>{orderMode === "wholesale" ? "Quantity (dozens)" : "Quantity"}</span>
                            <input
                              aria-label={
                                orderMode === "wholesale"
                                  ? `Quantity in dozens of ${perfume.name}`
                                  : `Quantity of ${perfume.name}`
                              }
                              disabled={comingSoon}
                              inputMode="numeric"
                              min="1"
                              onChange={(event) => {
                                const setQuantity =
                                  orderMode === "wholesale"
                                    ? setWholesaleQuantityByScent
                                    : setQuantityByScent;
                                setQuantity((current) => ({
                                  ...current,
                                  [perfume.id]: event.target.value,
                                }));
                              }}
                              step="1"
                              type="number"
                              value={quantityText}
                            />
                          </label>
                        </div>
                        <p className="shop-card-price">
                          {orderMode === "wholesale"
                            ? selectedWholesaleSize
                              ? selectedWholesaleSize.unit === 12
                                ? <>Price: <strong>UGX {formatUgx(selectedWholesaleSize.wholesale)} per dozen (12 bottles)</strong></>
                                : <>Price: <strong>UGX {formatUgx(selectedWholesaleSize.wholesale)} per bottle</strong><span> · 12 bottles: UGX {formatUgx(selectedWholesaleSize.wholesale * 12)}</span></>
                              : "Price unavailable"
                            : selectedSize
                              ? <>Price: <strong>UGX {formatUgx(selectedSize.retail)}</strong></>
                              : "Price unavailable"}
                        </p>
                        <button
                          className="btn shop-card-add"
                          disabled={
                            !isCartHydrated ||
                            comingSoon ||
                            (orderMode === "wholesale"
                              ? !selectedWholesaleSize
                              : !selectedSize) ||
                            quantity === null
                          }
                          onClick={() => {
                            if (orderMode === "wholesale") {
                              addWholesaleScent(
                                perfume,
                                selectedWholesaleSize,
                                quantityText,
                              );
                            } else {
                              addSingleScent(
                                perfume,
                                selectedSize,
                                quantityText,
                              );
                            }
                          }}
                          type="button"
                        >
                          {comingSoon ? "Coming soon" : "Add to cart"}
                        </button>
                      </>
                    ) : (
                      <button
                        aria-pressed={selectedForMix}
                        className="btn shop-card-add shop-mix-select"
                        disabled={comingSoon}
                        onClick={() => toggleMixScent(perfume.id)}
                        type="button"
                      >
                        {comingSoon
                          ? "Coming soon"
                          : selectedForMix
                            ? "Remove from blend"
                            : "Add to blend"}
                      </button>
                    )}
                  </div>
                </SignatureScentCard>
              );
            })}
          </div>
        ) : (
          <p className="shop-no-results">No perfumes match your search and filter.</p>
        )}
      </div>

      <button
        aria-controls="shop-cart-panel"
        aria-expanded={isCartOpen}
        aria-label={
          isCartHydrated
            ? `${isCartOpen ? "Close" : "Open"} ${orderMode} cart, ${activeCartCount} ${orderMode === "wholesale" ? "bottles" : activeCartCount === 1 ? "item" : "items"}`
            : "Loading saved cart"
        }
        className="shop-cart-trigger"
        disabled={!isCartHydrated}
        onClick={() => setIsCartOpen((open) => !open)}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path
            d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 8H6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <circle cx="10" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
        <span aria-hidden="true" className="shop-cart-count">{activeCartCount}</span>
      </button>

      <aside
        aria-label={`${orderMode === "wholesale" ? "Wholesale" : "Retail"} shopping cart`}
        aria-live="polite"
        className="shop-cart-panel"
        hidden={!isCartOpen}
        id="shop-cart-panel"
      >
        <div className="shop-cart-heading">
          <h2>{orderMode === "wholesale" ? "Wholesale cart" : "Shopping cart"} <span>({activeCartCount})</span></h2>
          <button
            aria-label="Close shopping cart"
            className="shop-cart-close"
            onClick={() => setIsCartOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
        {orderMode === "retail" && cart.length === 0 ? (
          <p className="shop-cart-empty">Your cart is empty. Choose a scent to add it here.</p>
        ) : orderMode === "wholesale" && wholesaleCart.length === 0 ? (
          <p className="shop-cart-empty">Your wholesale cart is empty. Choose a scent to add a dozen.</p>
        ) : orderMode === "retail" ? (
          <>
            <ul className="shop-cart-items">
              {cart.map((item) => {
                const itemName =
                  item.kind === "mix" ? "Custom scent blend" : item.scents.join(" + ");
                return (
                  <li className="shop-cart-item" key={cartItemKey(item)}>
                    <div className="shop-cart-item-details">
                      <strong>{itemName}</strong>
                      {item.kind === "mix" && (
                        <span>Scents: {item.scents.join(" + ")}</span>
                      )}
                      <span>
                        {item.sizeMl} ml · UGX {formatUgx(item.unitPrice)} per bottle
                      </span>
                      <div
                        aria-label={`Quantity controls for ${itemName}`}
                        className="shop-cart-quantity"
                      >
                        <button
                          aria-label={`Decrease quantity of ${itemName}`}
                          disabled={item.quantity <= 1}
                          onClick={() => changeCartQuantity(item, -1)}
                          type="button"
                        >
                          −
                        </button>
                        <output aria-label={`Quantity: ${item.quantity}`}>
                          {item.quantity}
                        </output>
                        <button
                          aria-label={`Increase quantity of ${itemName}`}
                          disabled={item.quantity >= Number.MAX_SAFE_INTEGER}
                          onClick={() => changeCartQuantity(item, 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="shop-cart-item-actions">
                      <strong>UGX {formatUgx(item.unitPrice * item.quantity)}</strong>
                      <button
                        aria-label={`Remove ${itemName}, ${item.sizeMl} ml from cart`}
                        onClick={() => removeCartItem(item)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="shop-cart-total">
              <strong>Total</strong>
              <strong>UGX {formatUgx(activeCartTotal)}</strong>
            </p>
          </>
        ) : (
          <>
            <ul className="shop-cart-items">
              {wholesaleCart.map((item) => {
                const itemName =
                  item.kind === "mix"
                    ? "Custom scent blend"
                    : item.scents.join(" + ");
                const priceDescription =
                  item.priceUnit === 12
                    ? `UGX ${formatUgx(item.unitPrice)} per dozen`
                    : `UGX ${formatUgx(item.unitPrice)} per bottle`;
                return (
                  <li className="shop-cart-item" key={wholesaleCartItemKey(item)}>
                    <div className="shop-cart-item-details">
                      <strong>{itemName}</strong>
                      {item.kind === "mix" && (
                        <span>Scents: {item.scents.join(" + ")}</span>
                      )}
                      <span>{item.sizeMl} ml · {item.dozens} dozen ({item.dozens * 12} bottles)</span>
                      <span>{priceDescription}</span>
                      <div
                        aria-label={`Quantity controls for ${itemName} wholesale dozens`}
                        className="shop-cart-quantity"
                      >
                        <button
                          aria-label={`Remove one dozen of ${itemName}`}
                          disabled={item.dozens <= 1}
                          onClick={() => changeWholesaleCartQuantity(item, -1)}
                          type="button"
                        >
                          −
                        </button>
                        <output aria-label={`Quantity: ${item.dozens} dozen`}>
                          {item.dozens}
                        </output>
                        <button
                          aria-label={`Add one dozen of ${itemName}`}
                          disabled={
                            item.dozens >=
                            maxWholesaleDozens(item.unitPrice, item.priceUnit)
                          }
                          onClick={() => changeWholesaleCartQuantity(item, 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="shop-cart-item-actions">
                      <strong>UGX {formatUgx(wholesaleItemTotal(item))}</strong>
                      <button
                        aria-label={`Remove ${itemName}, ${item.sizeMl} ml from wholesale cart`}
                        onClick={() => removeWholesaleCartItem(item)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p aria-live="polite" className="shop-wholesale-cart-status">
              {wholesaleCartTotal >= wholesaleMinimum
                ? `Wholesale minimum met. ${wholesaleCartCount} bottles are ready to order.`
                : `Minimum order UGX ${formatUgx(wholesaleMinimum)}. Add UGX ${formatUgx(wholesaleMinimum - wholesaleCartTotal)} more to complete a wholesale order.`}
            </p>
            <p className="shop-cart-total">
              <strong>Total</strong>
              <strong>UGX {formatUgx(activeCartTotal)}</strong>
            </p>
          </>
        )}
        {whatsappHref ? (
          <a className="btn shop-buy-button" href={whatsappHref}>
            Order Now
          </a>
        ) : (
          <button className="btn shop-buy-button" disabled type="button">
            Order Now
          </button>
        )}
      </aside>
    </section>
  );
}

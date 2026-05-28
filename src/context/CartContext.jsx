import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [quantities, setQuantities] = useState({});

  const addOne = useCallback((id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeOne = useCallback((id) => {
    setQuantities((prev) => {
      const next = { ...prev };
      const n = (next[id] || 0) - 1;
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setQuantities({});
  }, []);

  const totalItems = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + b, 0),
    [quantities]
  );

  const value = useMemo(
    () => ({
      quantities,
      addOne,
      removeOne,
      clearCart,
      totalItems,
    }),
    [quantities, addOne, removeOne, clearCart, totalItems]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

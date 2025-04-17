import { createContext, useState, useEffect } from "react";

import api from "../lib/axios";

const CartContext = createContext(null);

//@ts-ignore

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const onAddToCart = async (product: any, quantity: number) => {
        try {
            const response = await api.post("/client/cart/items", {
                product_id: product.id,
                quantity,
            });
            console.log("adding To cart");

            console.log(response);
        } catch {
            console.log("error");
        }
    };

    const fetchCart = async () => {
        try {
            const response = await api.get("/client/cart/");
            console.log("fetching cart");

            console.log(response);
            setCart(response.data.items);
        } catch {
            console.log("error");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart, onAddToCart }}>
            {children}
        </CartContext.Provider>
    );
};
export { CartContext };
export default CartProvider;

import React, { useState } from "react";
import CardProduit from "./cart/CardProduit";
import PanierSidebar from "./cart/PanierSidebar";
import SummaryOrder from "./cart/SummaryOrder";
// import Navbar from "../layout/Navbar";
const Home = () => {
    // Mock products data
    const products = [
        {
            id: 1,
            name: "FIFA 24",
            price: 69.99,
            image: "https://via.placeholder.com/300x200?text=FIFA+24",
        },
        {
            id: 2,
            name: "Call of Duty",
            price: 59.99,
            image: "https://via.placeholder.com/300x200?text=Call+of+Duty",
        },
        {
            id: 3,
            name: "Assassin's Creed",
            price: 49.99,
            image: "https://via.placeholder.com/300x200?text=Assassin's+Creed",
        },
        {
            id: 4,
            name: "Hogwarts Legacy",
            price: 54.99,
            image: "https://via.placeholder.com/300x200?text=Hogwarts+Legacy",
        },
    ];
    // Cart state
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    // Add item to cart
    const handleAddToCart = (product: any) => {
        setCartItems((prevItems: any) => {
            const existingItem = prevItems.find(
                (item: any) => item.id === product.id
            );
            if (existingItem) {
                return prevItems.map((item: any) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + product.quantity,
                          }
                        : item
                );
            } else {
                return [...prevItems, product];
            }
        });
        setIsCartOpen(true);
    };
    // Remove item from cart
    const handleRemoveItem = (id: string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item: any) => item.id !== id)
        );
    };
    // Update quantity
    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems: any) =>
            prevItems.map((item: any) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    // Checkout handler
    const handleCheckout = () => {
        alert(
            "Proceeding to checkout! Total: " +
                cartItems
                    .reduce(
                        (sum, item: any) => sum + item.price * item.quantity,
                        0
                    )
                    .toFixed(2) +
                " €"
        );
        setIsSummaryOpen(false);
        // Here you would typically redirect to a checkout page
    };
    // Calculate total cart items for badge
    const cartItemCount = cartItems.reduce(
        (sum, item: any) => sum + item.quantity,
        0
    );
    return (
        <div>
            {/* <Navbar
                cartItemCount={cartItemCount}
                toggleCart={() => setIsCartOpen(!isCartOpen)}
            /> */}

            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">
                    Welcome to GameXpress
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <CardProduit
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
                {/* Cart Sidebar */}
                <PanierSidebar
                    cartItems={cartItems}
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    onRemoveItem={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onViewSummary={() => {
                        setIsCartOpen(false);
                        setIsSummaryOpen(true);
                    }}
                />
                {/* Order Summary Modal */}
                {isSummaryOpen && (
                    <SummaryOrder
                        cartItems={cartItems}
                        onClose={() => setIsSummaryOpen(false)}
                        onCheckout={handleCheckout}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
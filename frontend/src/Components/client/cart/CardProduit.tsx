import React, { useState } from 'react';

// interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   image: string;
//   stock: string;
// }

interface CardProduitProps {
  product: any;
  onAddToCart: (product:any) => void;
}


const CardProduit = (props: CardProduitProps) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        props.onAddToCart({ ...props.product, quantity });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
                src={props.product.image}
                alt={props.product.name}
                className="w-full h-48 object-cover object-center"
            />

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {props.product.name}
                </h3>
                <p className="text-xl font-bold text-indigo-700 mb-3">
                    {props.product.price.toFixed(2)} €
                </p>

                <div className="flex items-center mb-4">
                    <label
                        htmlFor={`quantity-${props.product.id}`}
                        className="mr-2 text-gray-700"
                    >
                        Quantité:
                    </label>
                    <div className="flex items-center border rounded-md">
                        <button
                            onClick={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                            }
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="px-2 py-1 text-center w-8">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default CardProduit;
// components/CustomerDetail.tsx
"use client";
import { Clock, MapPin, Phone, Star, ShoppingCart } from "lucide-react";

interface CustomerDetailProps {
  customer: Customer;
  purchasedProducts: PurchasedProduct[];
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    level: string;
    favorite_menu: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PurchasedProduct {
    name: string;
    quantity: number;
}

export default function CustomerDetail({ customer, purchasedProducts }: CustomerDetailProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Star className="text-yellow-500" />
        <h1 className="text-2xl font-bold">{customer.name}</h1>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="text-gray-500" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-gray-500" />
          <span>{customer.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-gray-500" />
          <span>Member since: {new Date(customer.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="text-yellow-500" />
          <span>Level: {customer.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-gray-500" />
          <span>Favorite Menu: {customer.favorite_menu}</span>
        </div>
      </div>

      {/* Purchased Products */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Purchased Products</h2>
        <ul className="space-y-2">
          {purchasedProducts.map((product, index) => (
            <li key={index} className="flex justify-between">
              <span>{product.name}</span>
              <span className="text-gray-500">Qty: {product.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
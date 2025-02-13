"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomerDetail, { Customer, PurchasedProduct } from "@/components/CustomerDetail";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerPage({ params }: PageProps) {
  const router = useRouter();

  const { id: customerId } = React.use(params);

  // State untuk menyimpan data customer dan produk yang dibeli
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/customers/${customerId}`);
        const { customer: fetchedCustomer, purchasedProducts: fetchedProducts } = response.data;

        setCustomer(fetchedCustomer);
        setPurchasedProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Failed to load customer data. Please try again later.");
        setLoading(false);
      }
    };

    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  // Tampilkan loading spinner jika data sedang dimuat
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <span className="text-gray-700">Loading...</span>
        </div>
      </Layout>
    );
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center mt-10">{error}</div>
      </Layout>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mt-6 ml-6">
        <button
          onClick={() => router.back()} // Menggunakan router.back() untuk kembali ke halaman sebelumnya
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>
      <div className="flex w-full mt-4">
        <div className="w-3/4 p-6">
          {customer && <CustomerDetail customer={customer} purchasedProducts={purchasedProducts} />}
        </div>
      </div>
    </div>
  );
}
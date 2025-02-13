"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { ArrowLeft } from "lucide-react";

export default function CreateCustomerPage() {
  const router = useRouter();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    level: "warga", // Default value
  });

  // State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Kirim data ke backend menggunakan POST request
      await axios.post("http://localhost:8080/api/v1/customers/", formData);

      // Tampilkan notifikasi sukses menggunakan SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Customer created successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect ke halaman sebelumnya setelah berhasil membuat customer
        router.back();
      });
    } catch (err) {
      console.error("Error creating customer:", err);

      // Tampilkan notifikasi error menggunakan SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create customer. Please try again later.",
        confirmButtonText: "OK",
      });

      setError("Failed to create customer. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-6 ml-6">
        <button
          onClick={() => router.back()} // Kembali ke halaman sebelumnya
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Customer</h1>

        {/* Form untuk membuat customer */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="warga">Warga</option>
              <option value="juragan">Juragan</option>
              <option value="sultan">Sultan</option>
              <option value="konglomerat">Konglomerat</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";
import { ChevronRight, Eye, Pencil, Trash, Search, Filter, RefreshCw, Plus, Printer } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

interface CustomerData {
  id: number;
  name: string;
  level: string;
  favorite_menu: string | null;
  total_transaction_value: number;
}

const TableComponent = () => {
  const router = useRouter();
  const [data, setData] = useState<CustomerData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:8080/api/v1/customers";
        const params: { page: number; limit: number; name?: string; level?: string } = { page: currentPage, limit: itemsPerPage };

        if (appliedSearchTerm) {
          url = "http://localhost:8080/api/v1/customers/search";
          params.name = appliedSearchTerm;
        }

        if (selectedLevel) {
          url = "http://localhost:8080/api/v1/customers/filter";
          params.level = selectedLevel;
        }

        const response = await axios.get(url, { params });
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } catch (err) {
        console.log(err);
        setError("Gagal memuat data pelanggan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, appliedSearchTerm, selectedLevel]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/customers/${id}`);
      const updatedResponse = await axios.get("http://localhost:8080/api/v1/customers", {
        params: { page: currentPage, limit: itemsPerPage },
      });
      setData(updatedResponse.data.data);
      setTotalPages(updatedResponse.data.pagination.totalPages);
      setTotalItems(updatedResponse.data.pagination.totalItems);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Pelanggan berhasil dihapus.",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus pelanggan. Silakan coba lagi.",
        confirmButtonText: "OK",
      });
      console.log(err);
      setError("Gagal menghapus pelanggan");
    }
  };

  if (isLoading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="relative w-full text-white p-6 rounded-lg h-52 mb-6">
        <div className="absolute inset-0 z-0 h-full">
          <Image
            src="/hero.png"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        
        <div className="relative z-10">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Customer</h1>
            <p className="mt-2 text-base">
              On this menu you will be able to create, edit, and also
              <br />
              delete the customer. Also, you can manage it easily.
            </p>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg">
            <button onClick={() => router.push(`/customer/create`)}
            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 text-lg rounded-lg font-medium">
              <Plus size={22} />
              Add New Customer
            </button>

            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search Customer"
                className="w-full pl-10 pr-20 py-3 text-lg rounded-lg border border-gray-300 text-gray-800 focus:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              <button
                className="absolute right-0 top-0 h-full bg-blue-600 text-white px-6 rounded-r-lg"
                onClick={() => setAppliedSearchTerm(inputValue)}
              >
                Search
              </button>
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 bg-gray-700/60 text-white px-6 py-3 text-lg rounded-lg font-medium shadow"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={22} />
                Filter
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  {["", "warga", "juragan", "sultan", "konglomerat"].map((level) => (
                    <button
                      key={level || "all"}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      onClick={() => {
                        setSelectedLevel(level);
                        setIsFilterOpen(false);
                      }}
                    >
                      {level ? level.charAt(0).toUpperCase() + level.slice(1) : "All Levels"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="flex items-center gap-2 bg-gray-700/60 text-white px-6 py-3 text-lg rounded-lg font-medium shadow"
              onClick={() => {
                setAppliedSearchTerm("");
                setInputValue("");
                setSelectedLevel("");
              }}
            >
              <RefreshCw size={22} />
              Refresh
            </button>

            <button className="bg-gray-700/60 text-white p-3 text-lg rounded-lg shadow">
              <Printer size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {["Nama Pelanggan", "Level", "Menu Favorit", "Total Transaksi", "Aksi"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.favorite_menu || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(item.total_transaction_value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/customer/${item.id}`)}
                      className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detail</span>
                    </button>
                    <button onClick={() => router.push(`/customer/edit/${item.id}`)}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center bg-red-100 px-3 py-1 rounded-md text-red-600 hover:bg-red-200"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Menampilkan {startItem}-{endItem} dari {totalItems} Pelanggan
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Sebelumnya
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded-md text-sm ${
                  num === currentPage ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
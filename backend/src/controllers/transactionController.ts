import { Request, Response } from 'express';
import pool from '../config/db';

interface ProductOrder {
  product_id: number;
  quantity: number;
}

interface ApiResponse<T> {
  message?: string;
  transactionId?: number;
  error?: string;
}

export const createTransaction = async (
  req: Request<{}, {}, { customer_id: number; products: ProductOrder[] }>,
  res: Response<ApiResponse<number>>
) => {
  const { customer_id, products }: { customer_id: number; products: ProductOrder[] } = req.body;

  let client;
  try {
    // Mulai transaksi
    client = await pool.connect();
    await client.query('BEGIN');

    // Hitung total amount
    let totalAmount = 0;

    for (const item of products) {
      const productQuery = `
        SELECT price, stock FROM products WHERE id = $1;
      `;
      const productResult = await client.query(productQuery, [item.product_id]);

      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }

      const product = productResult.rows[0];

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }

      totalAmount += product.price * item.quantity;
    }

    // Insert transaksi
    const transactionQuery = `
      INSERT INTO transactions (customer_id, total_amount)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const transactionResult = await client.query(transactionQuery, [customer_id, totalAmount]);
    const transactionId = transactionResult.rows[0].id;

    // Insert detail transaksi dan update stok
    for (const item of products) {
      const insertDetailQuery = `
        INSERT INTO transaction_details (transaction_id, product_id, quantity, subtotal)
        VALUES ($1, $2, $3, $4);
      `;

      const productPriceQuery = `
        SELECT price FROM products WHERE id = $1;
      `;
      const productPriceResult = await client.query(productPriceQuery, [item.product_id]);
      const productPrice = productPriceResult.rows[0].price;

      const subtotal = item.quantity * productPrice;

      await client.query(insertDetailQuery, [
        transactionId,
        item.product_id,
        item.quantity,
        subtotal,
      ]);

      const updateStockQuery = `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2;
      `;
      await client.query(updateStockQuery, [item.quantity, item.product_id]);
    }

    // Commit transaksi
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Transaction created successfully',
      transactionId,
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error(error);

    // Pastikan error memiliki tipe yang jelas
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  } finally {
    if (client) client.release();
  }
};

// contoh request body
// {
//   "customer_id": 1,
//   "products": [
//     { "product_id": 101, "quantity": 2 },
//     { "product_id": 102, "quantity": 1 }
//   ]
// }
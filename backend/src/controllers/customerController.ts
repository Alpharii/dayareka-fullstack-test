import pool from '../config/db';

interface Customer {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  level?: string;
  favorite_menu?: string | null;
}

// Interface untuk Pagination
interface PaginationParams {
  limit: number;
  page: number;
}

export const addCustomer = async (req: any, res: any) => {
  const {
    name,
    email,
    phone,
    address,
    level = 'warga',
    favorite_menu
  }: Customer = req.body

  // Validasi level
  const validLevels = ['warga', 'juragan', 'sultan', 'konglomerat']
  if (level && !validLevels.includes(level)) {
    return res.status(400).json({ error: 'Invalid level value' })
  }

  try {
    const query = `
        INSERT INTO customers (name, email, phone, address, level, favorite_menu)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `
    const values = [name, email, phone, address, level, favorite_menu || null]
    const result = await pool.query(query, values)
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getCustomerDetails = async (req: any, res: any) => {
  const { id } = req.params

  try {
    // Query customer details
    const customerQuery = `
        SELECT * FROM customers WHERE id = $1 AND deleted_at IS NULL;
      `
    const customerResult = await pool.query(customerQuery, [id])

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const customer = customerResult.rows[0]

    // Query purchased products
    const productsQuery = `
        SELECT p.name, td.quantity
        FROM transaction_details td
        JOIN transactions t ON td.transaction_id = t.id
        JOIN products p ON td.product_id = p.id
        WHERE t.customer_id = $1;
      `
    const productsResult = await pool.query(productsQuery, [id])

    res.status(200).json({
      customer,
      purchasedProducts: productsResult.rows
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getAllCustomers = async (req: any, res: any) => {
  try {
    // Ambil query params dari request
    const { limit = 10, page = 1 } = req.query as PaginationParams

    // Validasi limit dan page
    const parsedLimit = Math.max(1, parseInt(limit.toString(), 10))
    const parsedPage = Math.max(1, parseInt(page.toString(), 10))

    // Hitung offset
    const offset = (parsedPage - 1) * parsedLimit

    // Query untuk mendapatkan data pelanggan beserta jumlah transaksi dan total nilai transaksi
    const query = `
        SELECT 
          c.id,
          c.name,
          c.email,
          c.phone,
          c.address,
          c.level, -- Tambahkan level
          c.favorite_menu, -- Tambahkan favorite_menu
          c.created_at,
          c.updated_at,
          c.deleted_at,
          COUNT(t.id) AS total_transactions,
          COALESCE(SUM(t.total_amount), 0) AS total_transaction_value
        FROM customers c
        LEFT JOIN transactions t ON c.id = t.customer_id
        WHERE c.deleted_at IS NULL
        GROUP BY c.id
        ORDER BY c.id ASC
        LIMIT $1 OFFSET $2;
      `
    const values = [parsedLimit, offset]
    const result = await pool.query(query, values)

    // Query untuk mendapatkan total jumlah pelanggan
    const countQuery = `
        SELECT COUNT(*) AS total FROM customers
        WHERE deleted_at IS NULL;
      `
    const countResult = await pool.query(countQuery)
    const total = parseInt(countResult.rows[0].total, 10)

    // Hitung total halaman
    const totalPages = Math.ceil(total / parsedLimit)

    // Kirim respons
    res.status(200).json({
      data: result.rows.map((row) => ({
        ...row,
        total_transactions: parseInt(row.total_transactions, 10),
        total_transaction_value: parseFloat(row.total_transaction_value)
      })),
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: total,
        itemsPerPage: parsedLimit
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const searchCustomerByName = async (req: any, res: any) => {
  const { name, limit = 10, page = 1 } = req.query;

  // Validate name parameter
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required and must be a string' });
  }

  try {
    const parsedLimit = Math.max(1, parseInt(limit.toString(), 10));
    const parsedPage = Math.max(1, parseInt(page.toString(), 10));
    const offset = (parsedPage - 1) * parsedLimit;

    // Query to search customers by name
    const query = `
      SELECT * FROM customers
      WHERE name ILIKE $1 AND deleted_at IS NULL
      ORDER BY name ASC
      LIMIT $2 OFFSET $3;
    `;
    const values = [`%${name}%`, parsedLimit, offset];
    const result = await pool.query(query, values);

    const countQuery = `
      SELECT COUNT(*) AS total FROM customers
      WHERE name ILIKE $1 AND deleted_at IS NULL;
    `;
    const countResult = await pool.query(countQuery, [`%${name}%`]);
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / parsedLimit);

    if (result.rows.length === 0) {
      return res.status(200).json({
        data: [],
        pagination: {
          currentPage: parsedPage,
          totalPages,
          totalItems: total,
          itemsPerPage: parsedLimit,
        },
      });
    }

    // Query to count total matching customers

    res.status(200).json({
      data: result.rows,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: total,
        itemsPerPage: parsedLimit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const filterCustomerByLevel = async (req: any, res: any) => {
  const { level, limit = 10, page = 1 } = req.query;

  // Validasi parameter level
  if (!level) {
    return res.status(400).json({ error: 'Level parameter is required' });
  }

  const validLevels = ['warga', 'juragan', 'sultan', 'konglomerat'];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ error: 'Invalid level value' });
  }

  try {
    // Parse limit dan page
    const parsedLimit = Math.max(1, parseInt(limit.toString(), 10));
    const parsedPage = Math.max(1, parseInt(page.toString(), 10));
    const offset = (parsedPage - 1) * parsedLimit;

    // Query untuk mendapatkan data customer berdasarkan level dengan paginasi
    const query = `
      SELECT * FROM customers
      WHERE level = $1 AND deleted_at IS NULL
      ORDER BY name ASC
      LIMIT $2 OFFSET $3;
    `;
    const values = [level, parsedLimit, offset];
    const result = await pool.query(query, values);

    // Query untuk menghitung total customer yang sesuai dengan filter
    const countQuery = `
      SELECT COUNT(*) AS total FROM customers
      WHERE level = $1 AND deleted_at IS NULL;
    `;
    const countResult = await pool.query(countQuery, [level]);
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / parsedLimit);

    // Jika tidak ada data yang ditemukan
    if (result.rows.length === 0) {
      return res.status(200).json({
        data: [],
        pagination: {
          currentPage: parsedPage,
          totalPages,
          totalItems: total,
          itemsPerPage: parsedLimit,
        },
      });
    }

    res.status(200).json({
      data: result.rows,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalItems: total,
        itemsPerPage: parsedLimit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCustomer = async (req: any, res: any) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    address,
    level,
    favorite_menu
  }: Partial<Customer> = req.body;

  // Validasi level jika diberikan
  const validLevels = ['warga', 'juragan', 'sultan', 'konglomerat'];
  if (level && !validLevels.includes(level)) {
    return res.status(400).json({ error: 'Invalid level value' });
  }

  try {
    // Ambil data pelanggan saat ini
    const currentCustomerQuery = `
      SELECT * FROM customers WHERE id = $1 AND deleted_at IS NULL;
    `;
    const currentCustomerResult = await pool.query(currentCustomerQuery, [id]);

    if (currentCustomerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const currentCustomer = currentCustomerResult.rows[0];

    // Buat query update dinamis berdasarkan field yang diberikan
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }
    if (address !== undefined) {
      updates.push(`address = $${paramIndex}`);
      values.push(address);
      paramIndex++;
    }
    if (level !== undefined) {
      updates.push(`level = $${paramIndex}`);
      values.push(level);
      paramIndex++;
    }
    if (favorite_menu !== undefined) {
      updates.push(`favorite_menu = $${paramIndex}`);
      values.push(favorite_menu || null);
      paramIndex++;
    }

    // Jika tidak ada field yang diberikan untuk diperbarui
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Tambahkan ID ke parameter terakhir
    values.push(id);

    const query = `
      UPDATE customers
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found or already deleted' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCustomer = async (req: any, res: any) => {
  const { id } = req.params

  try {
    const query = `
        UPDATE customers
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *;
      `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Customer not found or already deleted' })
    }

    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

import pool from '../services/database';

export class CustomerController {
  public static async getAll() {
    try {
      const result = await pool.query("SELECT * FROM Customers");

      return result.rows;

    } catch (err: any) {
      throw new Error(`Erro ao buscar Clientes do banco: ${err.message}`);
    }
  }
}

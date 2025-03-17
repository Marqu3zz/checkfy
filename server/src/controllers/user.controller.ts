import pool from "../services/database";
import bcrypt from 'bcrypt';
import {IUser} from "../models/user.model";

export class UserController {
    public static async getAll() {
        try {
            const result = await pool.query(`SELECT * FROM users`);

            return result.rows;
        }catch (err) {
            throw new Error(`Erro ao buscar dados do usuário ${err}`)
        }
    }

    public static async getById(id: number) {
        try {
            const result = await pool.query(`SELECT * FROM users WHERE id=${id}`);

            return result.rows[0];
        } catch (err) {
            throw new Error(`Erro ao buscar usuário ${id}: ${err}`)
        }
    }

    public static async create(body: IUser) {
        body.password = await this.hashPassword(body.password);

        try {
            const result = await pool.query(
                `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`,
                [body.name, body.email, body.password]
            );

            return result.rows[0];
        } catch (err) {
            throw new Error(`Erro ao cadastrar usuário: ${err}`);
        }
    }

    public static async update(id: number, body: IUser) {
        if (body.password) {
            body.password = await this.hashPassword(body.password);
        }

        try {
            const result = await pool.query(
                `UPDATE users 
                 SET name =  COALESCE($1, name), 
                     email = COALESCE($2, email), 
                     password = COALESCE($3, password)
                 WHERE id = $4
                 RETURNING *`,
                [body.name, body.email, body.password, id]
            );

            return result.rows[0];
        } catch (err) {
            throw new Error(`Erro ao atualizar usuário ${id}: ${err}`);
        }
    }

    public static async delete(id: number) {
        try {
            return await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        } catch (err) {
            throw new Error(`Erro ao deletar usuário: ${err}`)
        }
    }

    private static async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
}

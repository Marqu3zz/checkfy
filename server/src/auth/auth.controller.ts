import pool from "../services/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {IUser} from '../models/user.model';

export class AuthController {
    public static async authenticate(body: {email: string, password: string}) {
        if (!body.password) {
            throw new Error("Password is required");
        }

        const query = `SELECT
                            U.id,
                            U.name,
                            U.email,
                            U.password
                       FROM users U
                       WHERE U.email = $1`
        ;

        const result = await pool.query(query, [body.email]);

        if (result.rowCount === 0) {
            throw new Error(`Usuário não encontrado.`);
        }

        const user: IUser = result.rows[0];

        const isMatch = await bcrypt.compare(body.password, user.password);

        if (!isMatch) {
            throw new Error(`Senha incorreta.`);
        }

        delete user.password;

        const token = jwt.sign(
            {id: user.id, email: user.email},
            'secret',
            { expiresIn: '1d' }
        );

        return {user, token};
    }

    public static async validateAccessToken(accessToken: string) {
        try {
          return jwt.verify(accessToken, 'secret');
        } catch (err: any) {
          throw new Error("Erro na autenticação: " + err.message);
        }
    }
}

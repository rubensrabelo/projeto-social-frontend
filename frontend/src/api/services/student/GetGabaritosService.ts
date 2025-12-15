import ENV from "../../../config/envConfig.ts";
import { AuthError } from "../../errors/AuthError.ts";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function GetGabaritoService(id_aluno: number) {
    const url = `${ENV.API_BASE_URL}/gabaritos/${id_aluno}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json()

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }



    return data.gabaritos ?? [];
}


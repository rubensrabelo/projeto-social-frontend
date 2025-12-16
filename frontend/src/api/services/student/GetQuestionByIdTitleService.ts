import ENV from "../../../config/envConfig.ts";
import { AuthError } from "../../errors/AuthError.ts";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function GetQuestionByIdTitleService(
    id_question: number,
    enunciado: string,
) {
    const url = `${ENV.API_BASE_URL}/professores/questao/buscar-por-id-e-titulo?questao_id=${id_question}&titulo=${encodeURIComponent(enunciado)}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    return response.json() || {};
}
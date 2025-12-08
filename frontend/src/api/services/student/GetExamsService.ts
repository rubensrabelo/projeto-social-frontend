import ENV from "../../../config/envConfig.ts";
import { AuthError } from "../../errors/AuthError.ts";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function GetExamsService(
    aluno_id: string,
) {
    const url = `${ENV.API_BASE_URL}/alunos/provas_aluno/${aluno_id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    const data = await response.json();

    return data["provas"] || {};
}

export async function GetExamByIdService(
    professor_id: string,
    prova_id: string
) {
    const url = `${ENV.API_BASE_URL}/professores/${professor_id}/provas/${prova_id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    const data = await response.json();

    return data["prova"] || {};
}
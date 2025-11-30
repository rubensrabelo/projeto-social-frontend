import ENV from "../../../config/envConfig.ts";
import { AuthError } from "../../errors/AuthError.ts";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function GetAllSchoolClassesByIdService(id_class: number) {
    const url = `${ENV.API_BASE_URL}/turmas/${id_class}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    const data = await response.json();

    return data;
}


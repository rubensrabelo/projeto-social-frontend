import ENV from "../../../config/envConfig.ts";
import { AuthError } from "../../errors/AuthError";
import type { LoginRequest } from "../../interface/Auth/LoginRequest";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function login(data: LoginRequest, type: string) {
    const params = new URLSearchParams();

    if (data.matricula !== undefined) {
        params.append("matricula", String(data.matricula));
    }

    if ("senha" in data && data.senha !== undefined) {
        params.append("senha", data.senha);
    }

    const url = `${ENV.API_BASE_URL}/${type}/login?${params.toString()}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    return await response.json();
}

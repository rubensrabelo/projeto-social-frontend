import ENV from "../../../config/envConfig.ts"
import { AuthError } from "../../errors/AuthError";
import type { LoginRequest } from "../../interface/Auth/LoginRequest";
import { parseErrorResponse } from "../../utils/parseErrorResponse.ts";

export async function login(data: LoginRequest, type: string) {
    const response = await fetch(`${ENV.API_BASE_URL}/${type}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const { message, status } = await parseErrorResponse(response);
        throw new AuthError(message, status);
    }

    return await response.json();
}
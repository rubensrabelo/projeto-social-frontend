export function saveUserSession(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
}
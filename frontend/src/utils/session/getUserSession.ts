export function getUserSession() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
}
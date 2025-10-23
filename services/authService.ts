export async function login(email: string, password: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_POS+"/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Failed to login");
  return res.json();
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_POS+"/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Failed to signup");
  return res.json();
}

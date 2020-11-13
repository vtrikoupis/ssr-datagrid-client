export const fetchColumns = async () => {
  const res = await fetch(process.env.API_URL + `users/no-role/settings`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json();
}
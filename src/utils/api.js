export const fetchColumns = async () => {
  const res = await fetch(process.env.API_URL + `users/no-role/settings`)
  console.log(res)
  if (!res.ok) throw new Error(res.statusText)
  return res.json();
}

export const updateRow = async (row) => {
  const {_id} = row;
  console.log(_id)
  const res = await fetch(process.env.API_URL + `users/${_id}`, {
    method: "PUT",
    mode: "cors",
    body: JSON.stringify(row),
    headers: new Headers({ "Content-Type": "application/json" }),
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.json();

}
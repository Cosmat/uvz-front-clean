export default function () {
  return {
    token: localStorage.getItem("jwt-token"),
    Name: localStorage.getItem("jwt-name"),
    id: localStorage.getItem("jwt-id"),
  };
}

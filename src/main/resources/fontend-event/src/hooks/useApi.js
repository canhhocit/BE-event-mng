import { useCallback } from "react";

const BASE = "http://localhost:8080/event-mng";

export function useApi() {
  const token = localStorage.getItem("token");

  const get = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  const post = useCallback(
    (path, body) =>
      fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    [token]
  );

  const put = useCallback(
    (path, body) =>
      fetch(`${BASE}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    [token]
  );

  // Dùng cho PATCH — chỉ cập nhật 1 field (vd: status)
  const patch = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  const del = useCallback(
    (path) =>
      fetch(`${BASE}${path}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    [token]
  );

  return { get, post, put, patch, del };
}
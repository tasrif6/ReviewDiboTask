const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://reviewdibotask.onrender.com";

// Helper to get auth header
function getAuthHeaders() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// Helper fetch wrapper
async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers ?? {}),
  };
  
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = "An error occurred";
    try {
      const errData = await res.json();
      errMsg = errData.detail ?? errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  // Handle empty JSON responses (like DELETE requests)
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }
  
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}

export async function getProducts() {
  return apiFetch("/api/products");
}

export async function getProduct(id) {
  return apiFetch(`/api/products/${id}`);
}

export async function createProduct(productData) {
  return apiFetch("/api/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return apiFetch(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export async function createReview(reviewData) {
  return apiFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function updateReview(id, reviewData) {
  return apiFetch(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(id) {
  return apiFetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });
}

export async function registerUser(name, email, password) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  if (data && data.access_token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      // Fetch user profile info
      try {
        const user = await apiFetch("/api/auth/me");
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      }
    }
  }
  return null;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (_) {}
    }
  }
  return null;
}

// Prosty Worker chroniący całą stronę jednym wspólnym hasłem.
//
// UWAGA: hasło jest tu wpisane wprost w kodzie (nie jako zmienna
// środowiskowa) — celowo, żeby uniknąć wcześniejszych problemów z
// konfigurowaniem "Variables and Secrets" w panelu Cloudflare. Żeby
// zmienić hasło, wystarczy podmienić wartość poniżej i wypchnąć nowy
// commit — nie trzeba nic klikać w panelu Cloudflare.
const SITE_PASSWORD = "Twarda6";

const COOKIE_NAME = "walne_auth";

// Ścieżki dostępne bez logowania.
const PUBLIC_PATHS = new Set(["/login.html", "/api/login", "/api/logout", "/favicon.ico"]);

// Rozszerzenia plików zawsze publicznych (logo, style, skrypt nawigacji) —
// z wyjątkiem plików w /materialy/, które mają zostać chronione mimo
// pasującego rozszerzenia (np. skany PDF).
const PUBLIC_EXTENSIONS = [".css", ".js", ".jpg", ".jpeg", ".png", ".svg", ".webp", ".ico"];

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function handleLogin(request) {
  const formData = await request.formData();
  const password = (formData.get("password") || "").toString();
  const next = (formData.get("next") || "/").toString();

  if (password !== SITE_PASSWORD) {
    const failUrl = new URL("/login.html", request.url);
    failUrl.searchParams.set("error", "1");
    if (next) failUrl.searchParams.set("next", next);
    return Response.redirect(failUrl.toString(), 302);
  }

  const token = await hashPassword(password);
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
  const safeNext = next.startsWith("/") ? next : "/";

  const headers = new Headers();
  headers.append("Set-Cookie", cookie);
  headers.append("Location", safeNext);
  return new Response(null, { status: 302, headers });
}

function handleLogout(request) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  headers.append("Location", new URL("/login.html", request.url).toString());
  return new Response(null, { status: 302, headers });
}

// Skoro html_handling jest ustawione na "none" (żeby uniknąć pętli
// przekierowań opisanej wyżej), Cloudflare przestaje też automatycznie
// serwować index.html pod samym "/" — musimy to zrobić sami.
function resolveAssetRequest(request, pathname) {
  if (pathname === "/demo" || pathname === "/demo/") {
    const url = new URL(request.url);
    url.pathname = "/demo.html";
    return new Request(url.toString(), request);
  }
  if (pathname === "/") {
    const url = new URL(request.url);
    url.pathname = "/index.html";
    return new Request(url.toString(), request);
  }
  return request;
}


// ---------------------------------------------------------------------------
// MAKIETA /test — osobne hasło i osobne ciasteczko (nie wpływa na resztę serwisu)
// ---------------------------------------------------------------------------
const TEST_PASSWORD = "testyTwarda6#";
const TEST_COOKIE = "test_auth";
const TEST_PUBLIC = new Set(["/test/login.html", "/test/test.css", "/test/test.js"]);

async function handleTestLogin(request) {
  const formData = await request.formData();
  const password = (formData.get("password") || "").toString();
  const next = (formData.get("next") || "/test/").toString();
  if (password !== TEST_PASSWORD) {
    const failUrl = new URL("/test/login.html", request.url);
    failUrl.searchParams.set("error", "1");
    return Response.redirect(failUrl.toString(), 302);
  }
  const token = await hashPassword(password);
  const headers = new Headers();
  headers.append("Set-Cookie", `${TEST_COOKIE}=${token}; Path=/test; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
  headers.append("Location", next.startsWith("/test") ? next : "/test/");
  return new Response(null, { status: 302, headers });
}

async function handleTest(request, env, url) {
  const p = url.pathname;
  if (p === "/api/test-login" && request.method === "POST") return handleTestLogin(request);
  if (p === "/api/test-logout") {
    const headers = new Headers();
    headers.append("Set-Cookie", `${TEST_COOKIE}=; Path=/test; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
    headers.append("Location", new URL("/test/login.html", request.url).toString());
    return new Response(null, { status: 302, headers });
  }
  if (p === "/test") return Response.redirect(new URL("/test/", request.url).toString(), 302);

  let assetPath = p;
  if (p === "/test/") assetPath = "/test/index.html";
  // dokumenty PDF są serwowane z istniejącego katalogu /materialy/ (bez duplikowania plików)
  if (p.startsWith("/test/dokumenty/")) assetPath = "/materialy/" + p.slice("/test/dokumenty/".length);

  if (!TEST_PUBLIC.has(p)) {
    const m = (request.headers.get("Cookie") || "").match(new RegExp(`${TEST_COOKIE}=([^;]+)`));
    const ok = m && m[1] === (await hashPassword(TEST_PASSWORD));
    if (!ok) {
      const r = new URL("/test/login.html", url.origin);
      r.searchParams.set("next", p);
      return Response.redirect(r.toString(), 302);
    }
  }
  const a = new URL(request.url);
  a.pathname = assetPath;
  let res = await env.ASSETS.fetch(new Request(a.toString(), request));
  if (res.status === 404 && !assetPath.includes(".")) {
    a.pathname = assetPath.replace(/\/$/, "") + ".html";
    const res2 = await env.ASSETS.fetch(new Request(a.toString(), request));
    if (res2.status === 200) res = res2;
  }
  const out = new Response(res.body, res);
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  out.headers.set("Cache-Control", "private, no-store");
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/test" || url.pathname.startsWith("/test/") ||
        url.pathname === "/api/test-login" || url.pathname === "/api/test-logout") {
      return handleTest(request, env, url);
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request);
    }
    if (url.pathname === "/api/logout") {
      return handleLogout(request);
    }

    const isPublicAsset =
      !url.pathname.startsWith("/materialy/") &&
      PUBLIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

    if (PUBLIC_PATHS.has(url.pathname) || isPublicAsset) {
      return env.ASSETS.fetch(resolveAssetRequest(request, url.pathname));
    }

    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : null;
    const expected = await hashPassword(SITE_PASSWORD);

    if (token === expected) {
      let res = await env.ASSETS.fetch(resolveAssetRequest(request, url.pathname));
      // Adres bez rozszerzenia (np. /demo, /Rut) -> spróbuj małymi literami + .html
      if (res.status === 404 && !url.pathname.includes(".") && url.pathname !== "/") {
        const alt = new URL(request.url);
        alt.pathname = url.pathname.replace(/\/$/, "").toLowerCase() + ".html";
        const res2 = await env.ASSETS.fetch(new Request(alt.toString(), request));
        if (res2.status === 200) res = res2;
      }
      return res;
    }

    const redirectUrl = new URL("/login.html", url.origin);
    redirectUrl.searchParams.set("next", url.pathname);
    return Response.redirect(redirectUrl.toString(), 302);
  },
};

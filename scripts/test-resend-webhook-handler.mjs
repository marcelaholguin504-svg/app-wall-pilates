// Prueba de integración del handler completo (sin red real hacia Resend:
// se reemplaza fetch por un stub que registra las llamadas). Correr con:
//   node --experimental-strip-types scripts/test-resend-webhook-handler.mjs

import { Readable } from "node:stream";
import { createHmac } from "node:crypto";
import handler from "../api/resend-webhook.ts";

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    console.log(`FAIL ${label}`);
    failures += 1;
  }
}

const SECRET = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
function sign(id, timestamp, body) {
  const secretBytes = Buffer.from(SECRET.replace(/^whsec_/, ""), "base64");
  const sig = createHmac("sha256", secretBytes).update(`${id}.${timestamp}.${body}`).digest("base64");
  return `v1,${sig}`;
}

function mockReq({ method = "POST", body, headers = {} }) {
  const req = Readable.from([Buffer.from(body)]);
  req.method = method;
  req.headers = headers;
  return req;
}

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

async function run() {
  process.env.RESEND_WEBHOOK_SECRET = SECRET;
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.ALERTAS_EMAIL = "marcela@example.com";
  delete process.env.ALERTAS_FROM_EMAIL;

  const fetchCalls = [];
  globalThis.fetch = async (url, opts) => {
    fetchCalls.push({ url, opts });
    return { ok: true, status: 200, text: async () => "" };
  };

  // --- Caso 1: firma inválida → 401, nunca intenta mandar nada ---
  {
    const body = JSON.stringify({ type: "email.bounced", data: { to: ["mama@example.com"] } });
    const req = mockReq({
      body,
      headers: { "svix-id": "id1", "svix-timestamp": String(Math.floor(Date.now() / 1000)), "svix-signature": "v1,firma-invalida" },
    });
    const res = mockRes();
    await handler(req, res);
    check("Caso 1: firma inválida responde 401", res.statusCode === 401);
    check("Caso 1: firma inválida NUNCA intenta mandar alerta", fetchCalls.length === 0);
  }

  // --- Caso 2: email.bounced con firma válida → 200 y SÍ manda la alerta ---
  {
    const body = JSON.stringify({ type: "email.bounced", data: { to: ["mama@example.com"] } });
    const id = "id2";
    const ts = String(Math.floor(Date.now() / 1000));
    const req = mockReq({ body, headers: { "svix-id": id, "svix-timestamp": ts, "svix-signature": sign(id, ts, body) } });
    const res = mockRes();
    await handler(req, res);
    check("Caso 2: evento válido responde 200", res.statusCode === 200);
    check("Caso 2: SÍ llamó a la API de Resend para mandar la alerta", fetchCalls.length === 1);
    const call = fetchCalls[0];
    check("Caso 2: llamó al endpoint correcto de Resend", call.url === "https://api.resend.com/emails");
    const sentBody = JSON.parse(call.opts.body);
    check("Caso 2: la alerta va a ALERTAS_EMAIL", sentBody.to === "marcela@example.com");
    check("Caso 2: el asunto es el pedido", sentBody.subject === "⚠️ Un correo de acceso no llegó");
    check("Caso 2: el cuerpo incluye el correo de la compradora", sentBody.text.includes("mama@example.com"));
    check("Caso 2: usó el remitente por defecto", sentBody.from === "Duerme Ya <alertas@duerme-ya.com>");
    check(
      "Caso 2: mandó la API key de Resend en el header de autorización",
      call.opts.headers.Authorization === "Bearer re_test_key"
    );
  }

  // --- Caso 3: evento irrelevante (email.delivered) → 200, sin mandar alerta ---
  {
    fetchCalls.length = 0;
    const body = JSON.stringify({ type: "email.delivered", data: { to: ["mama@example.com"] } });
    const id = "id3";
    const ts = String(Math.floor(Date.now() / 1000));
    const req = mockReq({ body, headers: { "svix-id": id, "svix-timestamp": ts, "svix-signature": sign(id, ts, body) } });
    const res = mockRes();
    await handler(req, res);
    check("Caso 3: evento irrelevante responde 200", res.statusCode === 200);
    check("Caso 3: NO manda alerta por un evento irrelevante", fetchCalls.length === 0);
  }

  // --- Caso 4: el evento es sobre un correo mandado a la propia dirección de alertas → nunca se re-alerta a sí misma ---
  {
    fetchCalls.length = 0;
    const body = JSON.stringify({ type: "email.bounced", data: { to: ["marcela@example.com"] } });
    const id = "id4";
    const ts = String(Math.floor(Date.now() / 1000));
    const req = mockReq({ body, headers: { "svix-id": id, "svix-timestamp": ts, "svix-signature": sign(id, ts, body) } });
    const res = mockRes();
    await handler(req, res);
    check("Caso 4: responde 200", res.statusCode === 200);
    check("Caso 4: NUNCA manda una alerta sobre sí misma (evita ciclo infinito)", fetchCalls.length === 0);
  }

  // --- Caso 5: Resend responde con error al mandar la alerta → igual responde 200 (solo se registra el error) ---
  {
    fetchCalls.length = 0;
    globalThis.fetch = async (url, opts) => {
      fetchCalls.push({ url, opts });
      return { ok: false, status: 500, text: async () => "error interno de resend" };
    };
    const body = JSON.stringify({ type: "email.complained", data: { to: ["otra@example.com"] } });
    const id = "id5";
    const ts = String(Math.floor(Date.now() / 1000));
    const req = mockReq({ body, headers: { "svix-id": id, "svix-timestamp": ts, "svix-signature": sign(id, ts, body) } });
    const res = mockRes();
    await handler(req, res);
    check("Caso 5: aunque falle el envío de la alerta, responde 200 a Resend", res.statusCode === 200);
    check("Caso 5: sí intentó mandar la alerta", fetchCalls.length === 1);
  }

  // --- Caso 6: método no permitido ---
  {
    const req = mockReq({ method: "GET", body: "" });
    const res = mockRes();
    await handler(req, res);
    check("Caso 6: GET responde 405", res.statusCode === 405);
  }

  console.log(`\n${failures === 0 ? "Todas las pruebas pasaron." : `${failures} prueba(s) fallaron.`}`);
  process.exit(failures === 0 ? 0 : 1);
}

run();

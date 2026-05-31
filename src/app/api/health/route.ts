export async function GET() {
  return Response.json({
    ok: true,
    service: "social-media",
    api: "zernio-proxy",
  });
}

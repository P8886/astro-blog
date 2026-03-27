// Cloudflare Pages Functions 中间件 (JavaScript 版本)
// 用于保护 /private/* 路径下的内容

export async function onRequest(context) {
  const { request, env } = context;
  const authHeader = request.headers.get("Authorization");

  // 从环境变量读取配置，若未配置则使用默认值
  // 部署时请在 Cloudflare Dashboard 设置环境变量
  const USER = env.BASIC_AUTH_USER || "admin";
  const PASS = env.BASIC_AUTH_PASS || "password123";

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    
    if (scheme === "Basic") {
      try {
        const decoded = atob(encoded);
        const colonIndex = decoded.indexOf(":");
        
        if (colonIndex !== -1) {
          const user = decoded.substring(0, colonIndex);
          const pass = decoded.substring(colonIndex + 1);
          
          if (user === USER && pass === PASS) {
            return await context.next();
          }
        }
      } catch {
        // 解码失败
      }
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Private Content"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

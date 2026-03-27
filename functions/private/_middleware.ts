// Cloudflare Pages Functions 中间件
// 用于保护 /private/* 路径下的内容

export const onRequest: PagesFunction = async (context) => {
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
        // Cloudflare Workers 环境支持 atob
        const decoded = atob(encoded);
        const colonIndex = decoded.indexOf(":");
        
        if (colonIndex !== -1) {
          const user = decoded.substring(0, colonIndex);
          const pass = decoded.substring(colonIndex + 1);
          
          if (user === USER && pass === PASS) {
            // 验证通过，放行请求
            return await context.next();
          }
        }
      } catch {
        // 解码失败，继续返回 401
      }
    }
  }

  // 验证失败或未携带认证信息，返回 401 状态码触发浏览器弹出登录框
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Private Content"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

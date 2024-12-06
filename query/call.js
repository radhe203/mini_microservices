import http from "http";

function processOption(url = "http://localhost:80", method = "GET", header, body) {
  const parsedUrl = new URL(url || "http://localhost:80");
  let headers = undefined;
  const jsonbody = JSON.stringify(body || {});
  
  if (method === "POST" || method === "PUT") {
    if (!header) {
      headers = {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonbody),
      };
    } else if (!header["Content-Type"]) {
      headers = {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(jsonbody),
        ...header,
      };
    } else {
      headers = {
        "Content-Length": Buffer.byteLength(jsonbody),
        ...header,
      };
    }
  }

  return {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + (parsedUrl.search || ""),
    port: parsedUrl.port || 80,
    method,
    ...(headers && { headers }),
  };
}

async function call(url, method = "GET", header, body) {
  const options = processOption(url, method, header, body);

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.ok = res.statusCode >= 200 && res.statusCode < 300;
      let response = '';

      res.on('data', (chunk) => {
        response += chunk;
      });

      res.on('end', () => {
        if (!res.ok) {
          return reject(
            new Error(`Request failed with status ${res.statusCode}: ${response}`)
          );
        }
        resolve({
          ok: res.ok,
          statusCode: res.statusCode,
          response
        });
      });
    });

    
    req.setTimeout(10000, () => {
      req.destroy(); 
      reject(new Error('Request timed out'));
    });

    req.on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });

    if (body && Object.keys(body).length > 0) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

export default call;

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const endpoints = (__ENV.K6_ENDPOINTS || '/,/libros,/categorias,/editoriales,/autores,/usuarios,/roles,/ejemplares,/prestamos,/auditoria')
  .split(',')
  .map((endpoint) => endpoint.trim())
  .filter(Boolean);

export const options = {
  stages: [
    { duration: __ENV.RAMP_UP || '20s', target: Number(__ENV.VUS || 5) },
    { duration: __ENV.STEADY || '40s', target: Number(__ENV.VUS || 5) },
    { duration: __ENV.RAMP_DOWN || '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  group('lecturas principales de biblioteca', () => {
    for (const endpoint of endpoints) {
      const response = http.get(`${BASE_URL}${endpoint}`);

      check(response, {
        [`GET ${endpoint} responde 2xx`]: (res) => res.status >= 200 && res.status < 300,
      });
    }
  });

  sleep(1);
}

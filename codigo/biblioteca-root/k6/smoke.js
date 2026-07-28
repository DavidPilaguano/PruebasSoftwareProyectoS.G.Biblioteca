import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

export const options = {
  vus: Number(__ENV.VUS || 1),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/`);

  check(response, {
    'GET / responde 200': (res) => res.status === 200,
    'GET / devuelve contenido': (res) => Boolean(res.body && res.body.length),
  });

  sleep(1);
}

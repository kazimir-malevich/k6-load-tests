// k6 run -e TEST_HOST=$TEST_HOST -e CKNS_ATKN=$CKNS_ATKN -e CKNS_IDTKN=$CKNS_IDTKN src/weather_watchers.js

import http from 'k6/http'
import { group, sleep, check } from 'k6';

export default function() {

  group('sign in with cookies', function () {
    const jar = http.cookieJar();
    jar.set(__ENV.TEST_HOST, 'ckns_atkn', __ENV.CKNS_ATKN);
    jar.set(__ENV.TEST_HOST, 'ckns_idtkn', __ENV.CKNS_IDTKN);
  });

  group('homepage', function () {
    const res = http.get(__ENV.TEST_HOST);
    check(res, {
      'homepage is status 200': (r) => r.status === 200,
      'verify homepage text': (r) =>
      r.body.includes('Your account'),
    });
  });

  group('weather watchers', function () {
    const res = http.get(`${__ENV.TEST_HOST}/weatherwatchers/`);
    check(res, {
      'weather watchers is status 200': (r) => r.status === 200,
      'verify homepage text': (r) =>
      r.body.includes('Summary of my reports'),
    });
    console.log(res.body);
  });
}

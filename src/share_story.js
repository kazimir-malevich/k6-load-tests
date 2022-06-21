// k6 run -e TEST_HOST=$TEST_HOST -e CKNS_ATKN=$CKNS_ATKN -e CKNS_IDTKN=$CKNS_IDTKN src/share_story.js

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

  group('share story', function () {

    const json =  {
      "display_text": "This is an automated test",
      "source_id": 6173,
      "opt_in_response": false,
      "custom_fields": [
        {
          "name": "Contact number ",
          "required": false,
          "value": "07123456789",
          "type": "text"
        },
        {
          "name": "Location ",
          "required": false,
          "value": "England",
          "type": "text"
        }
      ],
      "source": "prompt_embed",
      "name": "full_name",
      "email": "x@x.com`",
      "anonymous": true,
      "source_url": "https://www.stage.bbc.co.uk/news/10725415",
      "age_over_16_confirmed": false,
      "terms_of_service_accepted": true
    }

    const rand = (Math.random() + 1).toString(36).substring(7)

    const params = {
      headers: { 'Content-Type': 'application/json' },
    };

    const mutated_json = JSON.stringify(json).replace("full_name", rand)

    const res = http.post(`${__ENV.TEST_HOST}/news/10725415/`, mutated_json, params);

    check(res, {
      'share story status 200': (r) => r.status === 200,
      'verify some "share story" respone text': (r) =>
      r.body.includes('This is an automated test"'),
    });
  });
}

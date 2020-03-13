//  Express
const express = require('express');
const bodyParser = require('body-parser');
const router = express().use(bodyParser.json());

//  Fetch API
const fetch = require('node-fetch');

//  global config
const config = require('./config.js');

//  global utils (baseCard)
const utils = require('./utils.js');

//  AoG
const { dialogflow } = require('actions-on-google');
const app = dialogflow();

// SysTalk

const PORT = config.PORT;
const URL_API = config.URL_API;

// 主流程意圖
app.intent('Default Fallback Intent', async conv => {
  let session = conv.body.session;
  let message = conv.input.raw;

  let payload = {
    message: {
      type: 1,
      text: message
    },
    sessionId: session
  };

  await systalk(conv, payload);
});

// 取得使用者資訊回饋 (好的, 不用了)
app.intent('Get Permission Intent', async (conv, params, permissionGranted) => {
  let session = conv.body.session;
  let message = '';
  let location = null;

  console.log(conv);

  if (permissionGranted) {
    const { requestedPermission } = conv.data;
    if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
      message = conv.device.location.formattedAddress
        .replace(/\d+/g, '')
        .split(',')
        .reverse()
        .join('');
      location = conv.device.location.coordinates;
    }
  } else {
    message = '@relisten';
  }

  let payload = {
    message: {
      type: 1,
      text: message
    },
    sessionId: session
  };

  if (location) payload.message.location = location;

  await systalk(conv, payload);
});

//  接收 AOG 傳來的訊息
router.post('/', app);
router.listen(PORT, () => console.log(`webhook starting at port ${PORT}`));

// send to systalk AI
async function systalk(conv, payload) {
  await fetch(URL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => systalkFallback(conv, json))
    .catch(error => conv.ask(error));
}

function systalkFallback(conv, json) {
  json.messages.forEach(item => {
    switch (item.type) {
      // 一般對話
      case 1:
        conv.ask(item.text.replace(/[\r\n]+$/g, ''));
        break;
      // 牌卡
      case 6:
        if (item.data[0].cTextType === '98') {
          if (item.data.length === 1) {
            conv.ask(utils.urlCard(item.data[0]));
          } else {
            conv.ask(utils.urlListCard(item.data));
          }
        } else if (item.data[0].cTextType === '97') {
          conv.ask(utils.listCard(item.data[0].cTitle), item.data);
        } else {
          conv.ask(utils.simpleResponse('ㄚ義能夠幫您找這些主題屋哦'));
          conv.ask(utils.listCard('主題找屋', item.data));
        }
        break;
      // 要求定位資訊
      case 9:
        // 向 DialogFlow 送出要求取得定位資訊
        let permission = 'DEVICE_PRECISE_LOCATION';
        conv.data.requestedPermission = permission;
        conv.ask(utils.askPermission('為了提供定位服務', permission));
        break;
      // Tags
      case 13:
        //  一般選項
        let suggestions = utils.suggestions(item.data);
        console.log('=== suggestions ===');
        console.log(suggestions);
        if (suggestions.suggestions.length > 0) conv.ask(suggestions);
        //  外部連結
        let link = item.data.find(option => !!option.url);
        console.log('=== Link ===');
        console.log(link);
        if (link) conv.ask(utils.linkOutSuggestion(link));
        break;
    }
  });
}

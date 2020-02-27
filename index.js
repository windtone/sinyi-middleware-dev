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
const stringUtils = require('./stringUtils.js');

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
  console.log(message);
  console.log(conv.input);
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
app.intent('Get Permission Intent', conv => {
  console.log(conv);
});

// 離開對話 (謝謝)
app.intent('Exit Conversation', conv => {
  console.log(conv);
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
  console.log('systalkFallback');
  console.log(json);
  json.messages.forEach(item => {
    switch (item.type) {
      // 一般對話
      case 1:
        conv.ask(utils.simpleResponse(item.text));
        break;
      // 要求定位資訊
      case 9:
        // 向 DialogFlow 送出要求取得定位資訊
        let permissions = [app.SupportedPermissions.DEVICE_PRECISE_LOCATION];
        conv.ask(utils.askPermission('為了提供定位服務', permissions));
        break;
      // Tags
      case 13:
        //  一般選項
        conv.ask(utils.suggestions(item.data));
        //  外部連結
        let link = item.data.find(option => !!option.url);
        if (link) conv.ask(utils.linkOutSuggestion(link));
        break;
    }
  });
}

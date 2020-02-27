//  Express
const express = require('express')
const bodyParser = require('body-parser')
const router = express().use(bodyParser.json())

//  Fetch API
const fetch = require('node-fetch')

//  global config
const config = require('./config.js')

//  global utils (baseCard)
const utils = require('./utils.js')
const stringUtils = require('./stringUtils.js')

//  AoG
const { dialogflow } = require('actions-on-google')
const app = dialogflow()

// SysTalk

const PORT = config.PORT
const URL_API = config.URL_API

// 主流程意圖
app.intent('Default Fallback Intent', conv => {
	let session = conv.body.session
	let message = conv.input.raw
	console.log(message)
	console.log(conv.input)
	let payload = {
		message: {
			type: 1,
			text: message,
		},
		sessionId: session,
	}

	systalk(conv, payload)
})

// 取得使用者資訊回饋 (好的, 不用了)
app.intent('Get Permission Intent', conv => {
	console.log(conv)
})

// 離開對話 (謝謝)
app.intent('Exit Conversation', conv => {
	console.log(conv)
})

//  接收 AOG 傳來的訊息
router.post('/', app)
router.listen(PORT, () => console.log(`webhook starting at port ${PORT}`))

// send to systalk AI
function systalk(conv, payload) {
	fetch(URL_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})
		.then(response => response.json())
		.then(json => systalkFallback(conv, json))
		.catch(error => conv.ask(error))
}

function systalkFallback(conv, json) {
	console.log('systalkFallback')
	console.log(json)
}

function getLocation() {
	const permissions = [app.SupportedPermissions.DEVICE_PRECISE_LOCATION]
	app.askForPermissions('為了提供定位服務', permissions)
}

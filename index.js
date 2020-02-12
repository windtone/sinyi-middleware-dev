//  Express
const express = require('express')
const bodyParser = require('body-parser')
const app = express().use(bodyParser.json())

//  Node Fetch
const fetch = require('node-fetch')

//  global config
const config = require('./config.js')

//  global utils (baseCard)
const utils = require('./utils.js')
const stringUtils = require('./stringUtils.js')

//  AOG
const conv = require('./conv.js')

const PORT = config.PORT
const URL_API = config.URL_API

//  接收 AOG 傳來的訊息
app.post('/', (req, res, next) => {
	let mMsgType = 1
	let mLocation = {}
	let repText = ''
	let content = req.body
	let headers = {
		'Content-Type': 'application/json',
	}

	//console.log(content.originalDetectIntentRequest)
	//console.log(content.originalDetectIntentRequest.payload.inputs[0].intent)

	if (conv.fallbackCancelGPS(content)) {
		repText = '@relisten'
	}
	//  如果有定位訊息統一傳送
	else if (conv.checkUserLocation(content)) {
		mLocation = conv.getUserLocation(content)
		let zipCode = mLocation.zipCode
		let formattedAddress = mLocation.formattedAddress.split(',')
		let city = formattedAddress[formattedAddress.length - 1].replace(/(\d)+/g, '')
		let area = formattedAddress[formattedAddress.length - 2]

		repText = stringUtils.isNullOrEmpty(zipCode) ? '@gpsnofound' : `${city}${area}`

		//console.log(mLocation)
	}

	try {
		repText =
			repText ||
			content.queryResult.queryText ||
			content.originalDetectIntentRequest.payload.inputs[0].rawInputs[0].query
	} catch (error) {}

	if (!repText) repText = '@relisten'

	//  傳送訊息到 Flow
	let payload = {
		message: {
			type: mMsgType,
			text: repText,
			location: mLocation,
		},
		sessionId: content.session,
	}

	fetch(URL_API, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(payload),
	})
		.then(response => response.json())
		.then(handleRequest)
		.catch(error => {
			console.log(error)
		})

	function handleRequest(repJson) {
		//  傳回 AOG
		try {
			let rep = {
				fulfillmentMessages: [],
			}

			let sendLocation = false

			repJson.messages.forEach(item => {
				switch (item.type) {
					//  一般對話
					case 1:
						rep.fulfillmentMessages.push(utils.replayTalk(item.text))
						break
					// 貼圖
					case 3:
						rep.fulfillmentMessages.push(utils.replayTalk(item.title))
						rep.fulfillmentMessages.push(utils.baseCard(item.title, item.alt, item.imgUrl, item.linkurl))
						break
					//  超連結窗
					case 5:
						rep.fulfillmentMessages.push(utils.replayTalk('其他服務'))
						let mNode = { items: [] }
						utils.browseCarouselCard(mNode, item)

						let reply = {
							type: 5,
							text: '昕力資訊',
							title: '昕力資訊',
							url: 'https://tpu.thinkpower.com.tw/tpu/',
						}
						utils.browseCarouselCard(mNode, reply)
						mNode = utils.pushBrowseCarouselCard(mNode)
						rep.fulfillmentMessages.push(mNode)
						break
					// 牌卡
					case 6:
						if (item.data[0].cTextType === '98') {
							// rep.fulfillmentMessages.push(
							//   utils.replayTalk(item.data[0].cTitle)
							// )
							rep.fulfillmentMessages.push(utils.urlListCard('為你找到以下符合的物件', item.data))
						} else {
							rep.fulfillmentMessages.push(utils.replayTalk('主題找屋'))
							rep.fulfillmentMessages.push(utils.titleList('主題找屋', item.data))
						}
						break
					case 9:
						let ans = conv.askPermission(
							['NAME', 'DEVICE_PRECISE_LOCATION', 'DEVICE_COARSE_LOCATION'],
							'為了提供更精準的訊息'
						)
						res.status(200).send(ans)
						sendLocation = true
						break
					// Tag 回應
					case 13:
						if (item.data.length > 0) {
							let arr = utils.tagCard(item.data)
							arr.forEach(item => {
								rep.fulfillmentMessages.push(item)
							})
						}
						break
					//  renew
					case 15:
						rep.fulfillmentMessages.push(utils.replayTalk('再見'))
						rep.fulfillmentMessages.push(utils.replayTalk(utils.byebye()))
						break
					//  電話按鈕
					case 16:
						let reply = utils.telButton(item.data)
						rep.fulfillmentMessages.push(reply)
						break
				}
			})
			console.log(rep)
			if (!sendLocation) res.status(200).send(rep)
			return next()
		} catch (error) {
			console.warn(error)

			res.sendStatus(403)
			return next()
		}
	}
})

app.listen(PORT, () => console.log(`webhook starting at http://localhost:${PORT}`))

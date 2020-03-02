const {
  SimpleResponse,
  Suggestions,
  LinkOutSuggestion,
  Permission,
  List,
  Image,
  BrowseCarousel,
  BrowseCarouselItem,
  BasicCard,
  Button
} = require('actions-on-google');

exports.simpleResponse = text => {
  return new SimpleResponse({ speech: text, text: text });
};

exports.suggestions = options => {
  let suggestion = [];

  options.forEach(option => {
    if (!option.url) {
      suggestion.push(option.title);
    }
  });

  return new Suggestions(suggestion);
};

exports.linkOutSuggestion = option => {
  return new LinkOutSuggestion({
    name: option.title,
    url: option.url
  });
};

exports.askPermission = (context, permissions) => {
  return new Permission({
    context: context,
    permissions: permissions
  });
};

exports.listCard = (title, data) => {
  let items = {};

  data.forEach(card => {
    card.cLinkList.forEach(item => {
      items[item.clText] = {
        title: item.clText,
        description: item.clAlt,
        image: new Image({
          url: card.cImageData ? card.cImageData.cImageUrl : '',
          alt: item.clAlt
        })
      };
    });
  });

  console.log(items);

  return new List({
    title: title,
    items: items
  });
};

exports.urlListCard = data => {
  let items = data.map(card => {
    let mText = ''; // 文案
    let mPattern = ''; // 格局
    let mAreaS = ''; // 坪數
    let mPrice = ''; // 價格
    let mPark = ''; // 車位

    card.cTexts.forEach(item => {
      if (item.cLabel === '物件名稱') {
        mTitle = item.cText;
      } else if (typeof item.cText === 'boolean') {
        mPark = item.cText ? '有車位' : '沒車位';
      } else if (item.cLabel === '格局') {
        mPattern = item.cText;
      } else if (item.cLabel === '建坪') {
        mAreaS = `${item.cText}坪`;
      } else if (item.cLabel === '價格') {
        mPrice = `$${item.cText}萬`;
      }
    });

    mText = `${mPattern} - ${mAreaS}\n${mPrice}\n${mPark}`;

    return new BrowseCarouselItem({
      title: mTitle,
      url: card.curl,
      description: mText,
      image: new Image({
        url: card.cImageData.cImageUrl,
        alt: mTitle
      })
    });
  });

  return new BrowseCarousel({
    items: items
  });
};

exports.urlCard = data => {
  let mText = ''; // 文案
  let mPattern = ''; // 格局
  let mAreaS = ''; // 坪數
  let mPrice = ''; // 價格
  let mPark = ''; // 車位

  console.log('=== data ===');
  console.log(data);

  data.cTexts.forEach(item => {
    if (item.cLabel === '物件名稱') {
      mTitle = item.cText;
    } else if (typeof item.cText === 'boolean') {
      mPark = item.cText ? '有車位' : '沒車位';
    } else if (item.cLabel === '格局') {
      mPattern = item.cText;
    } else if (item.cLabel === '建坪') {
      mAreaS = `${item.cText}坪`;
    } else if (item.cLabel === '價格') {
      mPrice = `$${item.cText}萬`;
    }
  });

  mText = `${mPattern} - ${mAreaS}\n${mPrice}\n${mPark}`;
  console.log('=== mText ===');
  console.log(mText);
  let ret = new BasicCard({
    title: mTitle,
    subtitle: mText,
    formattedText: '',
    image: new Image({
      url: data.cImageData.cImageUrl,
      alt: mTitle,
      width: 128,
      height: 128
    }),
    imageDisplayOptions: 'CROPPED'
  });
  console.log('=== ret ===');
  console.log(ret);

  return ret;
};

const {
  SimpleResponse,
  Suggestions,
  LinkOutSuggestion,
  Permission,
  List,
  Image
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
  let items = [];

  data.forEach(card => {
    card.cLinkList.forEach(item => {
      items.push({
        title: item.clText,
        description: item.clAlt,
        image: new Image({
          url: card.cImageData ? card.cImageData.cImageUrl : '',
          alt: item.clAlt
        })
      });
    });
  });

  console.log(items);

  return new List({
    title: title,
    items: items
  });
};

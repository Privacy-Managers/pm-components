const tableList = document.querySelector("pm-table");
const tableListReverse = document.querySelector("pm-table.reverse");
document.addEventListener("DOMContentLoaded", () =>
{
  const objItems = [];
  for (let i = 0; i < 300; i++) {
    objItems.push({
      id:    `example${i}.com`,
      texts: {"domain": `example${i}.com`, "cookienum": "3 Cookies"},
      titles: {
        "whitelist": "Whitelisting toggle"
      },
      data: {
        "whitelist": true
      }
    });
  }
  tableList.addItems(objItems);
  addSubItems("example0.com");
  addSubItems("example5.com");
  document.querySelectorAll("pm-tab-panel")[0].select("cookie");
  document.querySelectorAll("pm-tab-panel")[1].select("templating");

  addItemsNetwork("https://example.com/", "send", "main_frame", 1);
  addItemsNetwork("https://google.com/", "receive", "main_frame", 2);
  addItemsNetwork("https://example.com/", "send", "main_frame", 3);
  addItemsNetwork("https://amazon.com/", "send", "main_frame", 4);
  addItemsNetwork("https://paypal.com/", "send", "main_frame", 5);
  addSubitemsNetwork(3);

});

function addItemsNetwork(url, requestType, frame, id)
{
  const item = {
    id: id,
    texts: {
      type: frame,
      url
    },
    data: {
      access: 0,
      type: requestType
    }
  }
  tableListReverse.addItems([item]);
}

function addSubitemsNetwork(parentId)
{
  const request = {
    "method": "GET",
    "Server": "nginx",
    "Date": "Mon, 25 Nov 2019 14:51:26 GMT",
    "Content-Type": "text/html; charset=utf-8",
    "Last-Modified": "Mon, 25 Nov 2019 14:46:49 GMT",
    "Transfer-Encoding": "chunked",
    "Connection": "keep-alive",
    "ETag": 'W/"5ddbe959-8aa9"',
    "Strict-Transport-Security": "max-age=31536000",
    "Content-Security-Policy": "default-src 'self'; img-src https://optimize.google.com * data:; style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://optimize.google.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com https://optimize.google.com; frame-src www.youtube-nocookie.com https://optimize.google.com;  connect-src https://www.google-analytics.com; font-src 'self' https://fonts.gstatic.com;",
    "X-Frame-Options": "sameorigin",
    "Content-Encoding": "gzip",
    "statusCode": "200",
    "statusLine": "HTTP/1.1 200 OK",
    "type": "main_frame",
    "url": "https://adblockplus.org/"
  };
  const items = [];
  for (const name in request) {
    const value = request[name];
    items.push({
      id: name,
      texts: {
        name, value
      }
    });
  }
  tableListReverse.addItems(items, parentId);
}

function addSubItems(parentId)
{
  const itemObjs = [];
  const order = [3,2,4,5,1];
  for (let i = 0; i < order.length; i++) {
    itemObjs.push({
      id:      `subexample${order[i]}.com`,
      texts:   {"name": `subexample${order[i]}.com`, "value": "3 Cookies"}
    });
  }
  tableList.addItems(itemObjs, parentId);

}
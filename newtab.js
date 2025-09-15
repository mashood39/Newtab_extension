// Load bookmarks
function loadBookmarks() {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = ""

  chrome.bookmarks.getTree((nodes) => {
    function traverse(bookmarkNodes) {
      for (let node of bookmarkNodes) {
        if (node.url) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = node.url;
          const img = document.createElement('img')
          img.src = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(node.url)}&size=16`;
          img.srcset = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(node.url)}&size=32 2x`
          img.alt = " "

          let text = node.title || node.url;
          if (text.length > 25) {
            text = text.substring(0, 25) + "...";
          }

          a.appendChild(img);
          a.appendChild(document.createTextNode(text));
          li.appendChild(a);
          list.appendChild(li);
        }
        if (node.children) {
          traverse(node.children)
        }
      }
    }
    traverse(nodes)
  })
}

// funtion calls
loadBookmarks();
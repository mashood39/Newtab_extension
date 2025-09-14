// Load bookmarks
function loadBookmarks() {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = ""

  chrome.bookmarks.getTree((nodes) => {
    function traverse(bookmarkNodes) {
      for (let node of bookmarkNodes) {
        if(node.url) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = node.url;
          a.textContent = node.title || node.url;
          a.target = "_blank"
          li.appendChild(a);
          list.appendChild(li);
        }
        if(node.children) {
          traverse(node.children)
        }
      }
    }
    traverse(nodes)
  })
}

// funtion calls
loadBookmarks();
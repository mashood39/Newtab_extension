let allBookmarks = [];

// Load bookmarks
function loadBookmarks() {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = ""
  allBookmarks = [];

  chrome.bookmarks.getTree((nodes) => {
    function traverse(bookmarkNodes) {
      for (let node of bookmarkNodes) {
        if (node.url) {
          allBookmarks.push(node);
        }
        if (node.children) {
          traverse(node.children)
        }
      }
    }
    traverse(nodes)
    displayBookmarks(allBookmarks);
  })
}

function displayBookmarks(bookmarksToDisplay) {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = "";

  for (let node of bookmarksToDisplay) {
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
}

// to filter bookmarks based on search input
function filterBookmarks() {
  const searchInput = document.getElementById('searchBar').value.toLowerCase();
  const filtered = allBookmarks.filter(bookmark => {
    const title = (bookmark.title || "").toLowerCase();
    const url = (bookmark.url || "").toLowerCase();
    return title.includes(searchInput) || url.includes(searchInput)
  })
  displayBookmarks(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  searchBar.addEventListener('input', filterBookmarks);
  loadBookmarks();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "focusSearch") {
      searchBar.focus();
    }
  })
})
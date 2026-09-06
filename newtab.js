let allBookmarks = [];
const HIDDEN_FOLDER_NAME = "personal";

// Load bookmarks
function loadBookmarks() {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = ""
  allBookmarks = [];

  chrome.bookmarks.getTree((nodes) => {
    function traverse(bookmarkNodes, insideHiddenFolder) {
      for (let node of bookmarkNodes) {
        const hidden = insideHiddenFolder || (!!node.title && node.title.trim().toLowerCase() === HIDDEN_FOLDER_NAME);
        if (node.url) {
          allBookmarks.push({ ...node, hidden });
        }
        if (node.children) {
          traverse(node.children, hidden)
        }
      }
    }
    traverse(nodes, false)
    applyFilters();
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

    const text = node.title || node.url;
    const label = document.createElement('span');
    label.textContent = text;
    label.title = text;

    a.appendChild(img);
    a.appendChild(label);
    li.appendChild(a);
    list.appendChild(li);
  }
}

// to filter bookmarks based on search input and the "show all" toggle
function applyFilters() {
  const searchInput = document.getElementById('searchBar').value.toLowerCase();
  const showAll = document.getElementById('showAllToggle').checked;
  const filtered = allBookmarks.filter(bookmark => {
    if (!showAll && bookmark.hidden) return false;
    const title = (bookmark.title || "").toLowerCase();
    const url = (bookmark.url || "").toLowerCase();
    return title.includes(searchInput) || url.includes(searchInput)
  })
  displayBookmarks(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const showAllToggle = document.getElementById('showAllToggle');
  searchBar.addEventListener('input', applyFilters);
  showAllToggle.addEventListener('change', applyFilters);
  loadBookmarks();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "focusSearch") {
      searchBar.focus();
    }
    if (request.action === "toggleShowAll") {
      showAllToggle.checked = !showAllToggle.checked;
      applyFilters();
    }
  })
})
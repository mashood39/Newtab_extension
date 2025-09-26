// Load bookmarks with folder structure
function loadBookmarks() {
  const list = document.getElementById('bookmarkList');
  list.innerHTML = ""

  chrome.bookmarks.getTree((nodes) => {
    console.log(nodes)
    displayBookmarksTree(nodes[0].children, list);
  })
}

function displayBookmarksTree(nodes, list) {
  for (let node of nodes) {
    if (node.children) {
      const li = document.createElement('li');

      const folderHeader = document.createElement('div');
      folderHeader.className = "folder-header";

      const toggleIcon = document.createElement('span');
      toggleIcon.textContent = "▼";
      toggleIcon.className = "toggle-icon";

      const folderTitle = document.createElement('span');
      folderTitle.textContent = node.title;
      folderTitle.className = "folder-title";
      folderTitle.style.fontWeight = "bold";
      folderTitle.style.display = "block";
      folderTitle.style.color = "white";

      folderHeader.appendChild(toggleIcon);
      folderHeader.appendChild(folderTitle);
      li.appendChild(folderHeader);

      const folderDiv = document.createElement('div');
      folderDiv.className = "folder-content";

      const ul = document.createElement('ul');

      folderDiv.appendChild(ul)
      li.appendChild(folderDiv);
      list.appendChild(li);

      //event: toggle folder
      folderHeader.addEventListener("click", () => {
        const isHidden = folderDiv.classList.toggle("hidden");
        toggleIcon.textContent = isHidden ? "▶" : "▼";
      })

      displayBookmarksTree(node.children, ul);

    } else if (node.url) {
      list.appendChild(createBookmarkItem(node))
    }
  }
}

function createBookmarkItem(node) {
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

  return li;
}

// to filter bookmarks based on search input
function filterBookmarks() {
  const searchInput = document.getElementById('searchBar').value.toLowerCase();
  const list = document.getElementById('bookmarkList');
  list.innerHTML = "";

  if (!searchInput) {
    loadBookmarks();
    return;
  }

  chrome.bookmarks.getTree((nodes) => {
    function filterTree(nodes) {
      const results = [];

      for (let node of nodes) {
        if (node.url) {
          const title = (node.title || "").toLowerCase();
          const url = (node.url || "").toLowerCase();
          if (title.includes(searchInput) || url.includes(searchInput)) {
            results.push(node)
          }
        }
        else if (node.children) {
          const folderName = (node.title || "").toLowerCase();

          if (folderName.includes(searchInput)) {
            results.push(node)
          } else {
            const filteredChildren = filterTree(node.children);
            if (filteredChildren.length > 0) {
              results.push({
                ...node,
                children: filteredChildren
              })
            }
          }
        }
      }
      return results;
    }

    const filteredTree = filterTree(nodes);
    displayBookmarksTree(filteredTree, list);
  })
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